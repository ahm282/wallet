import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from util.helpers import getUnixTime
from sqlalchemy.orm import Session, load_only
from typing import Dict, List, Optional, Any
from models.psql.dashboard_stat import DashboardStat
from models.psql.user import User
from services.data_fetch import (
    fetch_transactions_for_user,
    fetch_accounts_for_user,
    fetch_bills_for_user,
    fetch_budgets_for_user,
    fetch_goals_for_user,
)
from config.database import (
    get_db,
    user_repository,
    dashboard_stats_repository,
    budget_analysis_repository,
    bill_forecast_repository,
    cash_flow_repository,
)


def get_dashboard_for_user(user_id: str, refresh: bool = False) -> Dict[str, Any]:
    """
    Get dashboard stats for a user from the database.
    If refresh=True or no stats found, compute new stats.
    """
    try:
        db = next(get_db())

        # Try to get existing stats first if not forcing refresh
        if not refresh:
            try:
                # Use a more targeted query with specific columns to avoid errors
                latest_stat = dashboard_stats_repository.get_latest_by_user_id(db, user_id)

                # Check if stats are recent (less than 24 hours old)
                if (
                    latest_stat
                    and (datetime.now() - latest_stat.created_at).total_seconds()
                    < 86400
                ):
                    try:
                        # Get the basic dashboard structure from the database
                        dashboard = format_dashboard_from_db(latest_stat)

                        # Add a flag to indicate that the data is from the cache
                        dashboard["from_cache"] = True

                        return dashboard
                    except Exception as e:
                        print(f"Error enriching dashboard: {str(e)}")
            except Exception as e:
                print(f"Error retrieving dashboard from cache: {str(e)}")
    except Exception as e:
        print(f"Error retrieving dashboard from cache: {str(e)}")

    # If we got here, either refresh=True, no recent stats, or enrichment failed
    print("Computing fresh dashboard")
    return compute_and_save_dashboard(user_id, db)


def compute_dashboard_stats(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Compute comprehensive dashboard statistics for a user based on their financial data.
    Returns a structured dashboard with multiple sections.
    """
    # Fetch user data
    transactions = fetch_transactions_for_user(user_id)
    accounts = fetch_accounts_for_user(user_id)
    bills = fetch_bills_for_user(user_id)
    budgets = fetch_budgets_for_user(user_id)
    goals = fetch_goals_for_user(user_id)

    if not transactions:
        return {
            "status": "limited",
            "message": "No transaction data found. Limited dashboard available.",
        }

    # Process transaction data
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], unit="ms", errors="coerce")

    # Compute time periods
    now = datetime.now()
    current_month_start = datetime(now.year, now.month, 1)
    previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    current_month_end = (now.replace(day=28) + timedelta(days=4)).replace(
        day=1
    ) - timedelta(seconds=1)

    # Filter by time periods
    current_month_df = df[(df["date"] >= current_month_start) & (df["date"] <= now)]
    previous_month_df = df[
        (df["date"] >= previous_month_start) & (df["date"] < current_month_start)
    ]

    # Compute dashboard sections
    dashboard = {
        "summary": _compute_summary_stats(df, current_month_df, previous_month_df),
        "accounts": _compute_account_stats(accounts),
        "spending": _compute_spending_stats(df, current_month_df, previous_month_df),
        "income": _compute_income_stats(df, current_month_df, previous_month_df),
        "bills": _compute_bill_stats(bills),
        "budgets": _compute_budget_stats(budgets),
        "goals": _compute_goal_stats(goals),
        "recent_activity": _compute_recent_activity(df),
        "generated_at": getUnixTime(),
        "from_cache": False,
    }

    return dashboard


def compute_and_save_dashboard(user_id: str, db: Session) -> Dict[str, Any]:
    """
    Compute dashboard stats and save them to the database.
    """
    # Get or create user
    try:
        user = user_repository.get(db, user_id)
        if not user:
            try:
                user = User(id=user_id)
                user = user_repository.create(db, user)
                print(f"Created user: {user.id}")
            except Exception as e:
                print(f"Failed to create user: {str(e)}")
                db.rollback()  # Add explicit rollback
                raise
    except Exception as e:
        print(f"Error checking/creating user: {str(e)}")
        db.rollback()  # Add explicit rollback
        # Still compute dashboard but don't save
        return compute_dashboard_stats(user_id)

    # Compute dashboard stats
    dashboard = compute_dashboard_stats(user_id)

    try:
        # Save summary stats to dashboard_stats table
        summary = dashboard.get("summary", {})
        accounts = dashboard.get("accounts", {})

        # Create dashboard_stat with ONLY the fields known to exist in the database
        dashboard_stat = DashboardStat(
            user_id=user_id,
            total_balance=accounts.get("total_balance", 0),
            month_income=float(summary.get("current_month", {}).get("income", 0)),
            month_expenses=float(summary.get("current_month", {}).get("spending", 0)),
            month_savings=float(summary.get("current_month", {}).get("net", 0)),
            savings_rate=(
                summary.get("current_month", {}).get("net", 0)
                / max(1, summary.get("current_month", {}).get("income", 1))
                * 100
            ),
            upcoming_bills_total=dashboard.get("bills", {}).get("total_due_amount", 0),
            largest_expense_category=get_largest_expense_category(dashboard),
            largest_expense_amount=get_largest_expense_amount(dashboard),
            goals_on_track=count_goals_on_track(dashboard),
            goals_at_risk=count_goals_at_risk(dashboard),
            period_start=datetime.now().replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            ),
            period_end=datetime.now(),
        )

        try:
            dashboard_stat = dashboard_stats_repository.create(db, dashboard_stat)
            db.commit()  # Commit after dashboard_stats creation
        except Exception as e:
            db.rollback()  # Explicitly rollback on error
            print(f"Failed to save dashboard stats: {str(e)}")
            # Continue with the rest of the function
    except Exception as e:
        db.rollback()  # Explicitly rollback on error
        print(f"Failed during dashboard stats processing: {str(e)}")

    try:
        # Save budget analyses
        save_budget_analyses(db, user_id, dashboard.get("budgets", {}))
        db.commit()  # Commit after budget analyses
    except Exception as e:
        db.rollback()  # Explicitly rollback on error
        print(f"Failed to save budget analyses: {str(e)}")

    try:
        # Save bill forecasts
        save_bill_forecasts(db, user_id, dashboard.get("bills", {}))
        db.commit()  # Commit after bill forecasts
    except Exception as e:
        db.rollback()  # Explicitly rollback on error
        print(f"Failed to save bill forecasts: {str(e)}")

    try:
        # Save cash flows
        save_cash_flows(db, user_id, dashboard)
        db.commit()  # Commit after cash flows
    except Exception as e:
        db.rollback()  # Explicitly rollback on error
        print(f"Failed to save cash flows: {str(e)}")

    try:
        # Update user's last analysis time
        if user:
            user.last_analysis = datetime.now()
            user_repository.update(db, user, {"last_analysis": user.last_analysis})
            db.commit()  # Final commit
    except Exception as e:
        db.rollback()  # Explicitly rollback on error
        print(f"Failed to update user's last analysis time: {str(e)}")

    return dashboard


####################
# Compute Stats
####################
def _compute_summary_stats(
    df: pd.DataFrame, current_month_df: pd.DataFrame, previous_month_df: pd.DataFrame
) -> Dict[str, Any]:
    """Compute summary financial statistics."""
    # All-time stats
    total_income = df[df["amount"] > 0]["amount"].sum()
    total_spending = abs(df[df["amount"] < 0]["amount"]).sum()
    net_flow = total_income - total_spending

    # Current month stats
    current_income = current_month_df[current_month_df["amount"] > 0]["amount"].sum()
    current_spending = (
        current_month_df[current_month_df["amount"] < 0]["amount"].abs().sum()
    )
    current_net = current_income - current_spending

    # Previous month stats
    previous_income = previous_month_df[previous_month_df["amount"] > 0]["amount"].sum()
    previous_spending = (
        previous_month_df[previous_month_df["amount"] < 0]["amount"].abs().sum()
    )
    previous_net = previous_income - previous_spending

    # Calculate month-over-month changes
    income_change = _calculate_percentage_change(previous_income, current_income)
    spending_change = _calculate_percentage_change(previous_spending, current_spending)
    net_change = _calculate_percentage_change(previous_net, current_net)

    # Calculate average daily spending this month
    if not current_month_df.empty:
        days_passed = (datetime.now() - current_month_df["date"].min()).days + 1
        avg_daily_spending = current_spending / max(1, days_passed)
    else:
        avg_daily_spending = 0

    return {
        "total_income": float(round(total_income, 2)),
        "total_spending": float(round(total_spending, 2)),
        "net_flow": float(round(net_flow, 2)),
        "current_month": {
            "income": float(round(current_income, 2)),
            "spending": float(round(current_spending, 2)),
            "net": float(round(current_net, 2)),
            "income_change": float(round(income_change, 2)),
            "spending_change": float(round(spending_change, 2)),
            "net_change": float(round(net_change, 2)),
            "avg_daily_spending": float(round(avg_daily_spending, 2)),
            "days_tracked": (
                len(current_month_df["date"].dt.date.unique())
                if not current_month_df.empty
                else 0
            ),
        },
        "status": "positive" if net_flow >= 0 else "negative",
    }


def _compute_account_stats(accounts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute account statistics."""
    if not accounts:
        return {"total_balance": 0, "accounts": []}

    formatted_accounts = []
    total_balance = 0

    for account in accounts:
        balance = account.get("balance", 0)
        total_balance += balance

        formatted_accounts.append(
            {
                "id": str(account.get("_id", "")),
                "name": account.get("name", ""),
                "institution": account.get("institution", ""),
                "balance": balance,
                "currency": account.get("currency", "USD"),
                "last_updated": account.get("updatedAt"),
            }
        )

    # Sort by balance (highest first)
    formatted_accounts.sort(key=lambda x: x["balance"], reverse=True)

    return {
        "total_balance": round(total_balance, 2),
        "account_count": len(accounts),
        "accounts": formatted_accounts,
    }


def _compute_spending_stats(
    df: pd.DataFrame, current_month_df: pd.DataFrame, previous_month_df: pd.DataFrame
) -> Dict[str, Any]:
    """Compute spending statistics and patterns."""
    # Filter expenses
    expenses_df = df[df["amount"] < 0].copy()
    expenses_df["amount"] = expenses_df["amount"].abs()  # Make positive for analysis

    current_expenses_df = current_month_df[current_month_df["amount"] < 0].copy()
    current_expenses_df["amount"] = current_expenses_df["amount"].abs()

    previous_expenses_df = previous_month_df[previous_month_df["amount"] < 0].copy()
    previous_expenses_df["amount"] = previous_expenses_df["amount"].abs()

    if expenses_df.empty:
        return {"total": 0}

    # Top spending categories this month
    if "category" in current_expenses_df.columns and not current_expenses_df.empty:
        category_spending = (
            current_expenses_df.groupby("category")["amount"].sum().nlargest(5)
        )
        top_categories = [
            {"category": cat, "amount": round(amt, 2)}
            for cat, amt in category_spending.items()
        ]
    else:
        top_categories = []

    # Spending by day of week
    if "date" in expenses_df.columns and not expenses_df.empty:
        expenses_df["day_of_week"] = expenses_df["date"].dt.day_name()
        day_spending = expenses_df.groupby("day_of_week")["amount"].agg(
            ["sum", "mean", "count"]
        )

        # Sort by days of week
        day_order = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        day_spending = day_spending.reindex(day_order)

        day_spending_data = {
            day: {
                "total": round(row["sum"] if not pd.isna(row["sum"]) else 0, 2),
                "average": round(row["mean"] if not pd.isna(row["mean"]) else 0, 2),
                "count": int(row["count"]) if not pd.isna(row["count"]) else 0,
            }
            for day, row in day_spending.iterrows()
            if day in day_spending.index
        }
    else:
        day_spending_data = {}

    # Monthly spending trends
    if "date" in expenses_df.columns and not expenses_df.empty:
        expenses_df["month"] = expenses_df["date"].dt.to_period("M")
        monthly_spending = expenses_df.groupby("month")["amount"].sum()

        monthly_trend = {
            str(idx): round(val, 2) for idx, val in monthly_spending.items()
        }

        # Calculate monthly average
        monthly_avg = monthly_spending.mean()
    else:
        monthly_trend = {}
        monthly_avg = 0

    # Largest single expenses this month
    if not current_expenses_df.empty:
        largest_expenses = current_expenses_df.nlargest(5, "amount")
        largest_expense_list = [
            {
                "date": (
                    int(row["date"].timestamp() * 1000)
                    if not pd.isna(row["date"])
                    else None
                ),
                "amount": round(row["amount"], 2),
                "description": row.get("description", ""),
                "category": row.get("category", "Unknown"),
            }
            for _, row in largest_expenses.iterrows()
        ]
    else:
        largest_expense_list = []

    return {
        "current_month_total": (
            round(current_expenses_df["amount"].sum(), 2)
            if not current_expenses_df.empty
            else 0
        ),
        "previous_month_total": (
            round(previous_expenses_df["amount"].sum(), 2)
            if not previous_expenses_df.empty
            else 0
        ),
        "monthly_average": round(monthly_avg, 2),
        "top_categories": top_categories,
        "by_day_of_week": day_spending_data,
        "monthly_trend": monthly_trend,
        "largest_expenses": largest_expense_list,
    }


def _compute_income_stats(
    df: pd.DataFrame, current_month_df: pd.DataFrame, previous_month_df: pd.DataFrame
) -> Dict[str, Any]:
    """Compute income statistics."""
    # Filter income
    income_df = df[df["amount"] > 0].copy()
    current_income_df = current_month_df[current_month_df["amount"] > 0].copy()
    previous_income_df = previous_month_df[previous_month_df["amount"] > 0].copy()

    if income_df.empty:
        return {"total": 0}

    # Monthly income trends
    if "date" in income_df.columns:
        income_df["month"] = income_df["date"].dt.to_period("M")
        monthly_income = income_df.groupby("month")["amount"].sum()

        monthly_trend = {str(idx): round(val, 2) for idx, val in monthly_income.items()}

        # Calculate monthly average and stability
        monthly_avg = monthly_income.mean()
        income_stability = (
            monthly_income.std() / monthly_income.mean()
            if len(monthly_income) > 1 and monthly_income.mean() > 0
            else 0
        )
        stability_score = max(0, min(100, 100 * (1 - income_stability)))
    else:
        monthly_trend = {}
        monthly_avg = 0
        stability_score = 0

    # Income sources
    if "description" in income_df.columns:
        income_sources = income_df.groupby("description")["amount"].agg(
            ["sum", "count"]
        )
        income_sources = income_sources.sort_values("sum", ascending=False)

        top_sources = [
            {
                "source": source,
                "total": round(data["sum"], 2),
                "frequency": int(data["count"]),
            }
            for source, data in income_sources.iterrows()
        ][:5]
    else:
        top_sources = []

    # Largest income transactions
    largest_income = income_df.nlargest(5, "amount")
    largest_income_list = [
        {
            "date": (
                int(row["date"].timestamp() * 1000)
                if not pd.isna(row["date"])
                else None
            ),
            "amount": round(row["amount"], 2),
            "description": row.get("description", ""),
        }
        for _, row in largest_income.iterrows()
    ]

    return {
        "current_month_total": (
            round(current_income_df["amount"].sum(), 2)
            if not current_income_df.empty
            else 0
        ),
        "previous_month_total": (
            round(previous_income_df["amount"].sum(), 2)
            if not previous_income_df.empty
            else 0
        ),
        "monthly_average": round(monthly_avg, 2),
        "stability_score": round(stability_score, 2),
        "top_sources": top_sources,
        "monthly_trend": monthly_trend,
        "largest_transactions": largest_income_list,
    }


def _compute_bill_stats(bills: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute bill payment statistics and upcoming bills."""
    if not bills:
        return {"total_bills": 0, "upcoming_bills": []}

    now = datetime.now()
    upcoming_bills = []
    paid_bills = []
    overdue_bills = []

    total_due_amount = 0
    total_paid_amount = 0

    for bill in bills:
        due_date = datetime.fromtimestamp(
            bill["dueDate"] / 1000
        )  # Convert from milliseconds
        days_until_due = (due_date - now).days
        amount = bill.get("amount", 0)
        is_paid = bill.get("paid", False)

        bill_info = {
            "id": str(bill.get("_id", "")),
            "payee": bill.get("payee", ""),
            "amount": amount,
            "due_date": (
                int(due_date.timestamp() * 1000) if not pd.isna(due_date) else None
            ),
            "days_until_due": days_until_due,
            "description": bill.get("description", ""),
            "paid": is_paid,
        }

        if is_paid:
            paid_bills.append(bill_info)
            total_paid_amount += amount
        elif days_until_due < 0:
            overdue_bills.append(bill_info)
            total_due_amount += amount
        elif days_until_due <= 14:  # Upcoming bills in the next 2 weeks
            upcoming_bills.append(bill_info)
            total_due_amount += amount

    return {
        "total_bills": len(bills),
        "total_due_amount": round(total_due_amount, 2),
        "total_paid_amount": round(total_paid_amount, 2),
        "upcoming_bills": upcoming_bills,
        "paid_bills": paid_bills,
        "overdue_bills": overdue_bills,
    }


def _compute_budget_stats(budgets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute budget statistics and spending progress."""
    if not budgets:
        return {"total_budgets": 0, "active_budgets": []}

    active_budgets = []
    total_budgets = 0
    total_spent = 0
    total_budgeted = 0

    for budget in budgets:
        amount = budget.get("budgeted", 0)
        spent = budget.get("spent", 0)

        total_budgets += 1
        total_spent += spent
        total_budgeted += amount

    return {
        "total_budgets": total_budgets,
        "total_spent": round(total_spent, 2),
        "total_budgeted": round(total_budgeted, 2),
        "active_budgets": active_budgets,
    }


def _compute_goal_stats(goals: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute financial goal statistics and progress."""
    if not goals:
        return {"total_goals": 0, "active_goals": []}

    now = datetime.now()
    active_goals = []
    total_goals = 0
    total_completed = 0
    total_target = 0

    for goal in goals:
        target_date = datetime.fromtimestamp(
            goal["targetDate"] / 1000
        )  # Convert from milliseconds
        target_amount = goal.get("targetAmount", 0)
        current_amount = goal.get("currentAmount", 0)

        goal_info = {
            "id": str(goal.get("_id", "")),
            "name": goal.get("name", ""),
            "target_amount": target_amount,
            "current_amount": current_amount,
            "target_date": (
                int(target_date.timestamp() * 1000)
                if not pd.isna(target_date)
                else None
            ),
            "progress": (
                round((current_amount / target_amount) * 100, 2)
                if target_amount > 0
                else 0
            ),
        }

        if now <= target_date:
            active_goals.append(goal_info)

        total_goals += 1
        total_completed += current_amount
        total_target += target_amount

    return {
        "total_goals": total_goals,
        "total_completed": round(total_completed, 2),
        "total_target": round(total_target, 2),
        "active_goals": active_goals,
    }


def _compute_recent_activity(df: pd.DataFrame) -> Dict[str, Any]:
    """Compute recent transaction activity."""
    if df.empty:
        return {"total_transactions": 0, "recent_transactions": []}

    recent_transactions = df.nlargest(5, "date")
    recent_transaction_list = [
        {
            "date": (
                int(row["date"].timestamp() * 1000)
                if not pd.isna(row["date"])
                else None
            ),
            "amount": round(row["amount"], 2),
            "description": row.get("description", ""),
            "category": row.get("category", "Unknown"),
        }
        for _, row in recent_transactions.iterrows()
    ]

    return recent_transaction_list


def _calculate_percentage_change(previous: float, current: float) -> float:
    """Calculate percentage change between two values."""
    return ((current - previous) / max(1, abs(previous))) * 100


####################
# Retrieve Stats from DB and Format
####################
def format_dashboard_from_db(dashboard_stat: DashboardStat) -> Dict[str, Any]:
    """
    Format a dashboard stat entity from the database into the API response format.
    Ensures the structure matches that of a freshly computed dashboard.

    Args:
        dashboard_stat: DashboardStat entity from database

    Returns:
        Dictionary with formatted dashboard data matching the compute_dashboard_stats format
    """
    # Create full structure that matches compute_dashboard_stats output
    return {
        "summary": {
            "total_income": dashboard_stat.month_income,
            "total_spending": dashboard_stat.month_expenses,
            "net_flow": dashboard_stat.month_savings,
            "current_month": {
                "income": float(dashboard_stat.month_income),
                "spending": float(dashboard_stat.month_expenses),
                "net": dashboard_stat.month_savings,
                "income_change": 0,  # Would need historical data for this
                "spending_change": 0,  # Would need historical data for this
                "net_change": 0,  # Would need historical data for this
                "avg_daily_spending": dashboard_stat.month_expenses
                / 30,  # Approximation
                "days_tracked": 30,  # Approximation
            },
            "status": "positive" if dashboard_stat.month_savings >= 0 else "negative",
        },
        "accounts": {
            "total_balance": dashboard_stat.total_balance,
            "account_count": 0,  # Not stored in DashboardStat
            "accounts": [],  # Would need to fetch from account repository
        },
        "spending": {
            "current_month_total": dashboard_stat.month_expenses,
            "previous_month_total": 0,  # Not stored in DashboardStat
            "monthly_average": dashboard_stat.month_expenses,  # Using current month as approximation
            "top_categories": (
                [
                    {
                        "category": dashboard_stat.largest_expense_category,
                        "amount": dashboard_stat.largest_expense_amount,
                    }
                ]
                if dashboard_stat.largest_expense_category != "Unknown"
                else []
            ),
            "by_day_of_week": {},  # Not stored in DashboardStat
            "monthly_trend": {},  # Not stored in DashboardStat
            "largest_expenses": [],  # Would need to fetch from transaction repository
        },
        "income": {
            "current_month_total": dashboard_stat.month_income,
            "previous_month_total": 0,  # Not stored in DashboardStat
            "monthly_average": dashboard_stat.month_income,  # Using current month as approximation
            "stability_score": 0,  # Not stored in DashboardStat
            "top_sources": [],  # Not stored in DashboardStat
            "monthly_trend": {},  # Not stored in DashboardStat
            "largest_transactions": [],  # Would need to fetch from transaction repository
        },
        "bills": {
            "total_bills": 0,  # Not stored in DashboardStat
            "total_due_amount": dashboard_stat.upcoming_bills_total,
            "total_paid_amount": 0,  # Not stored in DashboardStat
            "upcoming_bills": [],  # Would need to fetch from bills repository
            "paid_bills": [],  # Would need to fetch from bills repository
            "overdue_bills": [],  # Would need to fetch from bills repository
        },
        "budgets": {
            "total_budgets": 0,  # Not stored in DashboardStat
            "total_spent": 0,  # Not stored in DashboardStat
            "total_budgeted": 0,  # Not stored in DashboardStat
            "active_budgets": [],  # Would need to fetch from budget repository
        },
        "goals": {
            "total_goals": dashboard_stat.goals_on_track + dashboard_stat.goals_at_risk,
            "total_completed": 0,  # Not stored in DashboardStat
            "total_target": 0,  # Not stored in DashboardStat
            "active_goals": [],  # Would need to fetch from goals repository
        },
        "recent_activity": [],  # Would need to fetch from transaction repository
        "generated_at": int(dashboard_stat.created_at.timestamp() * 1000),
        "from_cache": True,
    }


def get_largest_expense_category(dashboard: Dict[str, Any]) -> str:
    """Extract the largest expense category from dashboard data."""
    top_categories = dashboard.get("spending", {}).get("top_categories", [])
    if top_categories:
        return top_categories[0].get("category", "Unknown")
    return "Unknown"


def get_largest_expense_amount(dashboard: Dict[str, Any]) -> float:
    """Extract the largest expense amount from dashboard data."""
    top_categories = dashboard.get("spending", {}).get("top_categories", [])
    if top_categories:
        return top_categories[0].get("amount", 0)
    return 0


def count_goals_on_track(dashboard: Dict[str, Any]) -> int:
    """Count the number of goals that are on track."""
    active_goals = dashboard.get("goals", {}).get("active_goals", [])
    on_track = 0
    for goal in active_goals:
        # Simple heuristic: if current progress >= expected progress based on time elapsed
        target_date_ms = goal.get("target_date")
        if target_date_ms:
            target_date = datetime.fromtimestamp(
                target_date_ms / 1000
            )  # Convert from milliseconds
        else:
            target_date = datetime.now()
        total_days = (target_date - datetime.now()).days
        progress = goal.get("progress", 0)

        if progress >= 0 and total_days > 0:
            on_track += 1

    return on_track


def count_goals_at_risk(dashboard: Dict[str, Any]) -> int:
    """Count the number of goals that are at risk."""
    active_goals = dashboard.get("goals", {}).get("active_goals", [])
    at_risk = 0
    for goal in active_goals:
        # Simple heuristic: if current progress < expected progress based on time elapsed
        target_date_ms = goal.get("target_date")
        if target_date_ms:
            target_date = datetime.fromtimestamp(
                target_date_ms / 1000
            )  # Convert from milliseconds
        else:
            target_date = datetime.now()
        total_days = (target_date - datetime.now()).days
        progress = goal.get("progress", 0)

        if progress < 0 or total_days <= 0:
            at_risk += 1

    return at_risk


####################
# Save to DB
####################
def save_budget_analyses(
    db: Session, user_id: str, budgets_data: Dict[str, Any]
) -> None:
    """Save budget analyses to the database."""
    from models.psql.budget_analysis import BudgetAnalysis

    active_budgets = budgets_data.get("active_budgets", [])

    for budget in active_budgets:
        budget_id = budget.get("id", "")
        if not budget_id:
            continue

        try:
            # Create budget analysis entry
            budget_analysis = BudgetAnalysis(
                user_id=user_id,
                budget_id=budget_id,
                name=budget.get("category", ""),
                budgeted=budget.get("amount", 0),
                spent=budget.get("spent", 0),
                remaining=budget.get("amount", 0) - budget.get("spent", 0),
                percentage_used=budget.get("progress", 0),
                status=(
                    "on_track"
                    if budget.get("spent", 0) <= budget.get("amount", 0)
                    else "overspent"
                ),
                period_start=(
                    datetime.fromtimestamp(budget.get("start_date") / 1000)
                    if isinstance(budget.get("start_date"), (int, float))
                    else datetime.now().replace(day=1)  # Default to first day of month
                ),
                period_end=(
                    datetime.fromtimestamp(budget.get("end_date") / 1000)
                    if isinstance(budget.get("end_date"), (int, float))
                    else datetime.now().replace(day=28)
                    + timedelta(days=4)  # Last day of month
                ),
            )

            budget_analysis_repository.create(db, budget_analysis)
        except Exception as e:
            print(f"Failed to save budget analysis: {str(e)}")
            raise


def save_bill_forecasts(db: Session, user_id: str, bills_data: Dict[str, Any]) -> None:
    """Save bill forecasts to the database."""
    from models.psql.bill_forecast import BillForecast

    upcoming_bills = bills_data.get("upcoming_bills", [])

    for bill in upcoming_bills:
        bill_id = bill.get("id", "")
        if not bill_id:
            continue

        try:
            # Create bill forecast entry
            bill_forecast = BillForecast(
                user_id=user_id,
                bill_id=bill_id,
                payee=bill.get("payee", ""),
                amount=bill.get("amount", 0),
                due_date=(
                    datetime.fromtimestamp(bill.get("due_date") / 1000)
                    if isinstance(bill.get("due_date"), (int, float))
                    else datetime.now()
                ),
                days_remaining=bill.get("days_until_due", 0),
                recurring=False,  # Would need additional data to determine this
                forecast_date=datetime.now(),
            )

            bill_forecast_repository.create(db, bill_forecast)
        except Exception as e:
            print(f"Failed to save bill forecast: {str(e)}")
            raise


def save_cash_flows(db: Session, user_id: str, dashboard: Dict[str, Any]) -> None:
    """Save cash flow data to the database."""
    from models.psql.cash_flow import CashFlow

    summary = dashboard.get("summary", {})
    current_month = summary.get("current_month", {})

    # Create monthly cash flow record
    now = datetime.now()
    month_id = f"{now.year}-{now.month:02d}"

    try:
        cash_flow = CashFlow(
            user_id=user_id,
            date=now,
            income=current_month.get("income", 0),
            expenses=current_month.get("spending", 0),
            net=current_month.get("net", 0),
            period_type="month",
            period_id=month_id,
        )

        cash_flow_repository.create(db, cash_flow)
    except Exception as e:
        print(f"Failed to save cash flow: {str(e)}")
        raise
