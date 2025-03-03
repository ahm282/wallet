import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
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
from services.predictions import (
    predict_cashflow_for_user,
    detect_anomalous_transactions,
)
from config.database import (
    get_db,
    user_repository,
    dashboard_stats_repository,
    budget_analysis_repository,
    bill_forecast_repository,
    cash_flow_repository,
)


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
        "alerts": _compute_alert_stats(user_id, df, accounts, bills, budgets),
        "cashflow": _compute_cashflow_stats(df),
        "generated_at": datetime.now().isoformat(),
    }

    return dashboard


def _compute_summary_stats(
    df: pd.DataFrame, current_month_df: pd.DataFrame, previous_month_df: pd.DataFrame
) -> Dict[str, Any]:
    """Compute summary financial statistics."""
    # All-time stats
    total_income = df[df["amount"] > 0]["amount"].sum()
    total_spending = df[df["amount"] < 0]["amount"].abs().sum()
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
        "total_income": round(total_income, 2),
        "total_spending": round(total_spending, 2),
        "net_flow": round(net_flow, 2),
        "current_month": {
            "income": round(current_income, 2),
            "spending": round(current_spending, 2),
            "net": round(current_net, 2),
            "income_change": round(income_change, 2),
            "spending_change": round(spending_change, 2),
            "net_change": round(net_change, 2),
            "avg_daily_spending": round(avg_daily_spending, 2),
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
                "id": account.get("_id", ""),
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
                "total": round(row["sum"], 2),
                "average": round(row["mean"], 2),
                "count": int(row["count"]),
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
                "date": row["date"].isoformat() if not pd.isna(row["date"]) else None,
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
            "date": row["date"].isoformat() if not pd.isna(row["date"]) else None,
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
            "id": bill.get("_id", ""),
            "payee": bill.get("payee", ""),
            "amount": amount,
            "due_date": due_date.isoformat(),
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

    now = datetime.now()
    active_budgets = []
    total_budgets = 0
    total_spent = 0
    total_budgeted = 0

    for budget in budgets:
        start_date = datetime.fromtimestamp(
            budget["startDate"] / 1000
        )  # Convert from milliseconds
        end_date = datetime.fromtimestamp(
            budget["endDate"] / 1000
        )  # Convert from milliseconds
        amount = budget.get("amount", 0)
        spent = budget.get("spent", 0)

        budget_info = {
            "id": budget.get("_id", ""),
            "category": budget.get("category", ""),
            "amount": amount,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "spent": spent,
            "progress": round((spent / amount) * 100, 2) if amount > 0 else 0,
        }

        if start_date <= now <= end_date:
            active_budgets.append(budget_info)

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
            "id": goal.get("_id", ""),
            "name": goal.get("name", ""),
            "target_amount": target_amount,
            "current_amount": current_amount,
            "target_date": target_date.isoformat(),
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
            "date": row["date"].isoformat() if not pd.isna(row["date"]) else None,
            "amount": round(row["amount"], 2),
            "description": row.get("description", ""),
            "category": row.get("category", "Unknown"),
        }
        for _, row in recent_transactions.iterrows()
    ]

    return {
        "total_transactions": len(df),
        "recent_transactions": recent_transaction_list,
    }


def _compute_alert_stats(
    user_id: str,
    df: pd.DataFrame,
    accounts: List[Dict[str, Any]],
    bills: List[Dict[str, Any]],
    budgets: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Compute financial alerts and anomalies."""
    if df.empty:
        return {"alerts": []}

    # Detect anomalous transactions
    anomalies = detect_anomalous_transactions(df)

    # Check for low account balances
    low_balance_alerts = []
    for account in accounts:
        balance = account.get("balance", 0)
        if balance < 100:
            low_balance_alerts.append(
                {
                    "account": account.get("name", ""),
                    "balance": round(balance, 2),
                    "currency": account.get("currency", "USD"),
                }
            )

    # Check for upcoming bills
    upcoming_bills_alerts = []
    for bill in bills:
        due_date = datetime.fromtimestamp(
            bill["dueDate"] / 1000
        )  # Convert from milliseconds
        days_until_due = (due_date - datetime.now()).days
        if days_until_due <= 7:
            upcoming_bills_alerts.append(
                {
                    "payee": bill.get("payee", ""),
                    "amount": round(bill.get("amount", 0), 2),
                    "due_date": due_date.isoformat(),
                    "days_until_due": days_until_due,
                }
            )

    # Check for overspending on budgets
    overspending_alerts = []
    for budget in budgets:
        amount = budget.get("amount", 0)
        spent = budget.get("spent", 0)
        if spent > amount:
            overspending_alerts.append(
                {
                    "category": budget.get("category", ""),
                    "amount": round(amount, 2),
                    "spent": round(spent, 2),
                }
            )

    return {
        "alerts": {
            "anomalies": anomalies,
            "low_balances": low_balance_alerts,
            "upcoming_bills": upcoming_bills_alerts,
            "overspending": overspending_alerts,
        }
    }


def _compute_cashflow_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """Compute cashflow statistics and predictions."""
    if df.empty:
        return {"predicted_cashflow": []}

    predictions = predict_cashflow_for_user(df)
    return {"predicted_cashflow": predictions}


def _calculate_percentage_change(previous: float, current: float) -> float:
    """Calculate percentage change between two values."""
    return ((current - previous) / max(1, abs(previous))) * 100


def predict_cashflow_for_user(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Predict future cashflow based on historical transaction data.

    Args:
        df: DataFrame containing transaction data with 'date' and 'amount' columns

    Returns:
        List of dictionaries with predicted cashflows for the next 30 days
    """
    if df.empty:
        return []

    # Ensure data is properly formatted
    if "date" not in df.columns or "amount" not in df.columns:
        return []

    # Create daily time series
    df = df.sort_values("date")
    df_daily = df.set_index("date").resample("D").sum().reset_index()

    # Fill missing dates with 0
    date_range = pd.date_range(start=df_daily["date"].min(), end=df_daily["date"].max())
    df_complete = (
        df_daily.set_index("date").reindex(date_range, fill_value=0).reset_index()
    )
    df_complete = df_complete.rename(columns={"index": "date"})

    # If we have less than 30 days of data, we can't make reliable predictions
    if len(df_complete) < 30:
        # Return simple projection based on average daily cashflow
        avg_daily_cashflow = df["amount"].sum() / len(df_complete)

        last_date = df["date"].max()
        predictions = []

        current_balance = df_complete["amount"].sum()

        for i in range(1, 31):
            pred_date = last_date + pd.Timedelta(days=i)
            current_balance += avg_daily_cashflow
            predictions.append(
                {
                    "date": pred_date.isoformat(),
                    "amount": round(avg_daily_cashflow, 2),
                    "balance": round(current_balance, 2),
                    "confidence": 0.5,  # Low confidence due to limited data
                }
            )

        return predictions

    # For more sophisticated predictions when we have enough data:
    # 1. Use time series decomposition to identify trend and seasonality
    from statsmodels.tsa.seasonal import seasonal_decompose

    # Resample to daily data and compute rolling statistics
    df_complete["rolling_mean"] = df_complete["amount"].rolling(window=7).mean()
    df_complete["rolling_std"] = df_complete["amount"].rolling(window=7).std()

    # Fill NaN values with first valid value
    df_complete = df_complete.fillna(method="bfill")

    # Try to decompose the time series if we have enough data
    try:
        decomposition = seasonal_decompose(
            df_complete["amount"],
            model="additive",
            period=7,  # Assuming weekly seasonality
        )
        trend = decomposition.trend
        seasonal = decomposition.seasonal
        residual = decomposition.resid

        # Fill NaN values
        trend = trend.fillna(method="bfill").fillna(method="ffill")
        seasonal = seasonal.fillna(method="bfill").fillna(method="ffill")
        residual = residual.fillna(method="bfill").fillna(method="ffill")

        # Use last values to predict next 30 days
        last_date = df_complete["date"].iloc[-1]
        last_trend = trend.iloc[-1]
        trend_change = (
            trend.iloc[-1] - trend.iloc[-8]
        ) / 7  # Average daily trend change

        predictions = []
        current_balance = df_complete["amount"].sum()

        for i in range(1, 31):
            pred_date = last_date + pd.Timedelta(days=i)
            seasonal_component = seasonal.iloc[-(7 - (i % 7))]
            pred_trend = last_trend + (trend_change * i)
            pred_amount = pred_trend + seasonal_component

            # Add some randomness based on residual standard deviation
            residual_std = residual.std()
            random_factor = np.random.normal(0, residual_std)
            pred_amount += random_factor

            current_balance += pred_amount

            predictions.append(
                {
                    "date": pred_date.isoformat(),
                    "amount": round(pred_amount, 2),
                    "balance": round(current_balance, 2),
                    "confidence": max(
                        0.5, min(0.9, 0.9 - (i / 60))
                    ),  # Decreasing confidence over time
                }
            )

        return predictions

    except:
        # Fallback to simpler prediction if decomposition fails
        avg_daily_cashflow = df_complete["amount"].mean()
        std_daily_cashflow = df_complete["amount"].std()

        last_date = df_complete["date"].iloc[-1]
        predictions = []

        current_balance = df_complete["amount"].sum()

        for i in range(1, 31):
            pred_date = last_date + pd.Timedelta(days=i)

            # Add some randomness based on historical standard deviation
            random_factor = np.random.normal(0, std_daily_cashflow / 2)
            pred_amount = avg_daily_cashflow + random_factor

            current_balance += pred_amount

            predictions.append(
                {
                    "date": pred_date.isoformat(),
                    "amount": round(pred_amount, 2),
                    "balance": round(current_balance, 2),
                    "confidence": 0.7,  # Moderate confidence
                }
            )

        return predictions


def detect_anomalous_transactions(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Detect anomalous transactions based on historical patterns.

    Args:
        df: DataFrame containing transaction data

    Returns:
        List of dictionaries with detected anomalies
    """
    if df.empty or len(df) < 5:
        return []

    # Make a copy to avoid modifying the original DataFrame
    df = df.copy()

    # Focus on spending (negative amounts)
    spending_df = df[df["amount"] < 0].copy()

    if spending_df.empty:
        return []

    # Calculate statistical thresholds for anomaly detection
    # Converting to absolute values for easier comparison
    spending_df["amount_abs"] = spending_df["amount"].abs()

    # Get mean and standard deviation of absolute amounts
    mean_amount = spending_df["amount_abs"].mean()
    std_amount = spending_df["amount_abs"].std()

    # Transactions with amount > mean + 2*std are potential anomalies
    threshold = mean_amount + (2 * std_amount)
    anomalies = spending_df[spending_df["amount_abs"] > threshold].copy()

    # If we have category data, also look for unusual spending in categories
    category_anomalies = []
    if "category" in spending_df.columns:
        # Calculate average spending by category
        category_means = spending_df.groupby("category")["amount_abs"].mean()
        category_stds = spending_df.groupby("category")["amount_abs"].std().fillna(0)

        for _, row in spending_df.iterrows():
            category = row.get("category")
            if pd.isna(category) or category not in category_means:
                continue

            cat_mean = category_means[category]
            cat_std = category_stds[category]
            cat_threshold = cat_mean + (
                2.5 * cat_std
            )  # Slightly higher threshold for categories

            if row["amount_abs"] > cat_threshold and row["amount_abs"] > mean_amount:
                if row["date"].isoformat() not in [
                    a.get("date") for a in category_anomalies
                ]:
                    category_anomalies.append(
                        {
                            "date": (
                                row["date"].isoformat()
                                if not pd.isna(row["date"])
                                else None
                            ),
                            "amount": round(float(row["amount"]), 2),
                            "description": row.get("description", ""),
                            "category": category,
                            "reason": f"Unusually large transaction for {category} category",
                        }
                    )

    # Format the results
    anomaly_list = []
    for _, row in anomalies.iterrows():
        anomaly_list.append(
            {
                "date": row["date"].isoformat() if not pd.isna(row["date"]) else None,
                "amount": round(float(row["amount"]), 2),
                "description": row.get("description", ""),
                "category": row.get("category", "Unknown"),
                "reason": "Unusually large transaction amount",
            }
        )

    # Combine both types of anomalies and remove duplicates
    all_anomalies = anomaly_list + category_anomalies
    seen_descriptions = set()
    unique_anomalies = []

    for anomaly in all_anomalies:
        key = (anomaly["date"], anomaly["amount"], anomaly["description"])
        if key not in seen_descriptions:
            seen_descriptions.add(key)
            unique_anomalies.append(anomaly)

    return unique_anomalies[:10]  # Limit to top 10 anomalies


def get_dashboard_for_user(user_id: str, refresh: bool = False) -> Dict[str, Any]:
    """
    Get dashboard stats for a user from the database.
    If refresh=True or no stats found, compute new stats.

    Args:
        user_id: The user ID
        refresh: Whether to force recompute stats

    Returns:
        Dictionary containing dashboard data
    """
    db = next(get_db())

    # Try to get existing stats first if not forcing refresh
    if not refresh:
        # Get most recent dashboard stats for user
        latest_stat = (
            db.query(DashboardStat)
            .filter(DashboardStat.user_id == user_id)
            .order_by(DashboardStat.created_at.desc())
            .first()
        )

        # If we have recent stats (less than 24 hours old), return them
        if (
            latest_stat
            and (datetime.now() - latest_stat.created_at).total_seconds() < 86400
        ):
            return format_dashboard_from_db(latest_stat)

    # Compute new stats and save to database
    return compute_and_save_dashboard(user_id, db)


def compute_and_save_dashboard(user_id: str, db: Session) -> Dict[str, Any]:
    """
    Compute dashboard stats and save them to the database.

    Args:
        user_id: The user ID
        db: Database session

    Returns:
        Dictionary containing dashboard data
    """
    # Get or create user
    user = user_repository.get(db, user_id)
    if not user:
        try:
            user = User(id=user_id)
            user = user_repository.create(db, user)
            print(f"Created user: {user.id}")
        except Exception as e:
            print(f"Failed to create user: {str(e)}")
            raise

    # Compute dashboard stats
    dashboard = compute_dashboard_stats(user_id)

    # Save summary stats to dashboard_stats table
    summary = dashboard.get("summary", {})
    accounts = dashboard.get("accounts", {})

    dashboard_stat = DashboardStat(
        user_id=user_id,
        total_balance=accounts.get("total_balance", 0),
        month_income=summary.get("current_month", {}).get("income", 0),
        month_expenses=summary.get("current_month", {}).get("spending", 0),
        month_savings=summary.get("current_month", {}).get("net", 0),
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

    dashboard_stat = dashboard_stats_repository.create(db, dashboard_stat)

    # Save budget analyses
    save_budget_analyses(db, user_id, dashboard.get("budgets", {}))

    # Save bill forecasts
    save_bill_forecasts(db, user_id, dashboard.get("bills", {}))

    # Save cash flows
    save_cash_flows(db, user_id, dashboard)

    # Update user's last analysis time
    user.last_analysis = datetime.now()
    user_repository.update(db, user, {"last_analysis": user.last_analysis})

    return dashboard


def format_dashboard_from_db(dashboard_stat: DashboardStat) -> Dict[str, Any]:
    """
    Format a dashboard stat entity from the database into the API response format.

    Args:
        dashboard_stat: DashboardStat entity from database

    Returns:
        Dictionary with formatted dashboard data
    """
    # Create basic structure
    return {
        "summary": {
            "total_income": dashboard_stat.month_income,
            "total_spending": dashboard_stat.month_expenses,
            "net_flow": dashboard_stat.month_savings,
            "current_month": {
                "income": dashboard_stat.month_income,
                "spending": dashboard_stat.month_expenses,
                "net": dashboard_stat.month_savings,
            },
            "status": "positive" if dashboard_stat.month_savings >= 0 else "negative",
        },
        "accounts": {
            "total_balance": dashboard_stat.total_balance,
        },
        "bills": {
            "total_due_amount": dashboard_stat.upcoming_bills_total,
        },
        "generated_at": dashboard_stat.created_at.isoformat(),
        "from_cache": True,
        # Note: For a complete dashboard, you'd need to join with other tables
        # This is just the summary data stored in dashboard_stats table
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
        target_date = datetime.fromisoformat(
            goal.get("target_date", datetime.now().isoformat())
        )
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
        target_date = datetime.fromisoformat(
            goal.get("target_date", datetime.now().isoformat())
        )
        total_days = (target_date - datetime.now()).days
        progress = goal.get("progress", 0)

        if progress < 0 or total_days <= 0:
            at_risk += 1

    return at_risk


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
            period_start=datetime.fromisoformat(
                budget.get("start_date", datetime.now().isoformat())
            ),
            period_end=datetime.fromisoformat(
                budget.get("end_date", datetime.now().isoformat())
            ),
        )

        budget_analysis_repository.create(db, budget_analysis)


def save_bill_forecasts(db: Session, user_id: str, bills_data: Dict[str, Any]) -> None:
    """Save bill forecasts to the database."""
    from models.psql.bill_forecast import BillForecast

    upcoming_bills = bills_data.get("upcoming_bills", [])

    for bill in upcoming_bills:
        bill_id = bill.get("id", "")
        if not bill_id:
            continue

        # Create bill forecast entry
        bill_forecast = BillForecast(
            user_id=user_id,
            bill_id=bill_id,
            payee=bill.get("payee", ""),
            amount=bill.get("amount", 0),
            due_date=datetime.fromisoformat(
                bill.get("due_date", datetime.now().isoformat())
            ),
            days_remaining=bill.get("days_until_due", 0),
            recurring=False,  # Would need additional data to determine this
            forecast_date=datetime.now(),
        )

        bill_forecast_repository.create(db, bill_forecast)


def save_cash_flows(db: Session, user_id: str, dashboard: Dict[str, Any]) -> None:
    """Save cash flow data to the database."""
    from models.psql.cash_flow import CashFlow

    summary = dashboard.get("summary", {})
    current_month = summary.get("current_month", {})

    # Create monthly cash flow record
    now = datetime.now()
    month_id = f"{now.year}-{now.month:02d}"

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
