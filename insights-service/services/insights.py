import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Any
from services.data_fetch import (
    fetch_transactions_for_user,
    fetch_budgets_for_user,
    fetch_bills_for_user,
)
from config.database import get_mongo_db


def calculate_insights_for_user(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Calculate comprehensive insights for a user from their transaction data.
    Returns multiple insight categories including spending patterns, budget performance,
    category breakdown, and monthly trends.
    """
    transactions = fetch_transactions_for_user(user_id)
    if not transactions:
        return None

    # Convert to DataFrame for easier analysis
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

    # Convert timestamps to datetime
    df["date"] = pd.to_datetime(df["date"], unit="ms", errors="coerce")
    df["month"] = df["date"].dt.to_period("M")

    # Add some useful derived columns
    df["day_of_week"] = df["date"].dt.day_name()
    df["week_of_year"] = df["date"].dt.isocalendar().week
    df["is_weekend"] = df["date"].dt.dayofweek >= 5

    # Split into income and expenses
    expenses_df = df[df["amount"] < 0].copy()
    expenses_df["amount"] = expenses_df[
        "amount"
    ].abs()  # Make positive for easier analysis
    income_df = df[df["amount"] > 0]

    insights = {
        "summary": _calculate_summary_insights(df),
        "category_breakdown": _calculate_category_insights(expenses_df),
        "monthly_trends": _calculate_monthly_trends(df),
        "spending_patterns": _calculate_spending_patterns(expenses_df),
        "income_analysis": _calculate_income_analysis(income_df),
        "budget_performance": _calculate_budget_performance(user_id, expenses_df),
        "bill_analysis": _calculate_bill_analysis(user_id),
        "anomalies": _detect_spending_anomalies(expenses_df),
    }

    return insights


def _calculate_summary_insights(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate summary statistics about user's financial activity."""
    if df.empty:
        return {
            "total_income": 0,
            "total_expenses": 0,
            "net_cashflow": 0,
            "average_transaction": 0,
            "transaction_count": 0,
        }

    total_income = df[df["amount"] > 0]["amount"].sum()
    total_expenses = abs(df[df["amount"] < 0]["amount"].sum())

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "net_cashflow": round(total_income - total_expenses, 2),
        "average_transaction": round(df["amount"].abs().mean(), 2),
        "transaction_count": len(df),
        "last_transaction_date": (
            df["date"].max().isoformat() if not pd.isna(df["date"].max()) else None
        ),
    }


def _calculate_category_insights(expenses_df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate detailed category breakdown with percentages and trends."""
    if expenses_df.empty:
        return {"categories": {}, "top_categories": []}

    # Basic category totals
    category_totals = expenses_df.groupby("category")["amount"].agg(
        ["sum", "count", "mean"]
    )
    category_totals = category_totals.round(2).to_dict(orient="index")

    # Convert to percentage of total spending
    total_spending = expenses_df["amount"].sum()
    for category in category_totals:
        category_totals[category]["percentage"] = round(
            (category_totals[category]["sum"] / total_spending) * 100, 2
        )

    # Get top 5 categories by spending
    top_categories = sorted(
        [
            {"name": category, "amount": data["sum"], "percentage": data["percentage"]}
            for category, data in category_totals.items()
        ],
        key=lambda x: x["amount"],
        reverse=True,
    )[:5]

    # Calculate month-over-month growth for categories
    if "month" in expenses_df.columns:
        category_monthly = expenses_df.pivot_table(
            index="month",
            columns="category",
            values="amount",
            aggfunc="sum",
            fill_value=0,
        )

        category_growth = {}
        for category in category_monthly.columns:
            if len(category_monthly[category]) >= 2:
                latest = category_monthly[category].iloc[-1]
                previous = category_monthly[category].iloc[-2]
                if previous > 0:
                    growth_pct = ((latest - previous) / previous) * 100
                    category_growth[category] = round(growth_pct, 2)
    else:
        category_growth = {}

    return {
        "categories": category_totals,
        "top_categories": top_categories,
        "category_growth": category_growth,
    }


def _calculate_monthly_trends(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate monthly spending and income trends over time."""
    if df.empty or "month" not in df.columns:
        return {"spending_trend": {}, "income_trend": {}, "net_cashflow_trend": {}}

    # Group by month and calculate metrics
    monthly_data = df.groupby("month").agg(
        {
            "amount": [
                ("income", lambda x: x[x > 0].sum()),
                ("expenses", lambda x: abs(x[x < 0].sum())),
                ("net", "sum"),
            ]
        }
    )

    # Flatten the multi-level column index
    monthly_data.columns = [f"{col[1]}" for col in monthly_data.columns]

    # Convert to dictionary with formatted month keys
    formatted_data = {}
    for idx, row in monthly_data.iterrows():
        month_str = idx.strftime("%Y-%m")
        formatted_data[month_str] = {
            "income": round(row["income"], 2) if not pd.isna(row["income"]) else 0,
            "expenses": (
                round(row["expenses"], 2) if not pd.isna(row["expenses"]) else 0
            ),
            "net": round(row["net"], 2) if not pd.isna(row["net"]) else 0,
        }

    # Calculate month-over-month changes
    months = sorted(formatted_data.keys())
    trends = {}

    if len(months) >= 2:
        current = months[-1]
        previous = months[-2]

        current_data = formatted_data[current]
        previous_data = formatted_data[previous]

        trends = {
            "income_change_pct": _calculate_percentage_change(
                previous_data["income"], current_data["income"]
            ),
            "expense_change_pct": _calculate_percentage_change(
                previous_data["expenses"], current_data["expenses"]
            ),
            "net_change_pct": _calculate_percentage_change(
                previous_data["net"], current_data["net"]
            ),
        }

    return {"monthly_data": formatted_data, "trends": trends}


def _calculate_spending_patterns(expenses_df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze spending patterns by day of week, time of day, etc."""
    if expenses_df.empty:
        return {}

    patterns = {}

    # Spending by day of week
    if "day_of_week" in expenses_df.columns:
        day_order = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        day_spending = (
            expenses_df.groupby("day_of_week")["amount"]
            .sum()
            .reindex(day_order)
            .fillna(0)
        )
        patterns["by_day_of_week"] = day_spending.round(2).to_dict()

        # Weekend vs weekday
        if "is_weekend" in expenses_df.columns:
            weekend_spending = expenses_df.groupby("is_weekend")["amount"].sum()
            weekend_dict = {
                "weekday": round(weekend_spending.get(False, 0), 2),
                "weekend": round(weekend_spending.get(True, 0), 2),
            }
            patterns["weekend_vs_weekday"] = weekend_dict

    # Average transaction size trend
    if "month" in expenses_df.columns:
        avg_size_trend = expenses_df.groupby("month")["amount"].mean().round(2)
        patterns["avg_transaction_size_trend"] = {
            idx.strftime("%Y-%m"): val for idx, val in avg_size_trend.items()
        }

    return patterns


def _calculate_income_analysis(income_df: pd.DataFrame) -> Dict[str, Any]:
    """Analyze income streams and stability."""
    if income_df.empty:
        return {}

    # Income by source/description
    income_by_source = income_df.groupby("description")["amount"].agg(["sum", "count"])
    income_by_source = income_by_source.sort_values("sum", ascending=False).round(2)

    # Income stability (coefficient of variation of monthly income)
    income_stability = {}
    if "month" in income_df.columns:
        monthly_income = income_df.groupby("month")["amount"].sum()
        if len(monthly_income) > 1:
            cv = (
                monthly_income.std() / monthly_income.mean()
                if monthly_income.mean() > 0
                else 0
            )
            income_stability = {
                "coefficient_of_variation": round(cv, 4),
                "stability_score": (
                    round(max(0, min(100, 100 * (1 - cv))), 2) if cv <= 1 else 0
                ),
            }

    return {
        "income_sources": income_by_source.to_dict(orient="index"),
        "stability": income_stability,
    }


def _calculate_budget_performance(
    user_id: str, expenses_df: pd.DataFrame
) -> Dict[str, Any]:
    """Compare actual spending against budgets."""
    budgets = fetch_budgets_for_user(user_id)
    if not budgets or expenses_df.empty:
        return {}

    # Convert budgets to a lookup dictionary
    budget_dict = {budget["name"].lower(): budget for budget in budgets}

    # Try to match categories to budget names
    performance = {}
    for category in expenses_df["category"].unique():
        category_lower = category.lower()
        matching_budget = None

        # Try direct match
        if category_lower in budget_dict:
            matching_budget = budget_dict[category_lower]
        # Try fuzzy matching (simplified version)
        else:
            for budget_name, budget in budget_dict.items():
                if budget_name in category_lower or category_lower in budget_name:
                    matching_budget = budget
                    break

        if matching_budget:
            category_spent = expenses_df[expenses_df["category"] == category][
                "amount"
            ].sum()
            budget_name = matching_budget["name"]
            budget_amount = matching_budget["budgeted"]

            # Calculate metrics
            remaining = budget_amount - category_spent
            percentage_used = (
                (category_spent / budget_amount) * 100 if budget_amount > 0 else 0
            )

            performance[budget_name] = {
                "budgeted": budget_amount,
                "spent": round(category_spent, 2),
                "remaining": round(remaining, 2),
                "percentage_used": round(percentage_used, 2),
                "status": "over_budget" if remaining < 0 else "on_track",
            }

    # Check for budgets without matching transactions
    for budget_name, budget in budget_dict.items():
        if budget_name not in performance:
            performance[budget_name] = {
                "budgeted": budget["budgeted"],
                "spent": round(float(budget.get("spent", 0)), 2),
                "remaining": round(
                    budget["budgeted"] - float(budget.get("spent", 0)), 2
                ),
                "percentage_used": round(
                    (
                        (float(budget.get("spent", 0)) / budget["budgeted"]) * 100
                        if budget["budgeted"] > 0
                        else 0
                    ),
                    2,
                ),
                "status": (
                    "untracked" if float(budget.get("spent", 0)) == 0 else "on_track"
                ),
            }

    return performance


def _calculate_bill_analysis(user_id: str) -> Dict[str, Any]:
    """Analyze bill payment history and upcoming bills."""
    bills = fetch_bills_for_user(user_id)
    if not bills:
        return {}

    now = datetime.now()
    upcoming_bills = []
    overdue_bills = []

    for bill in bills:
        due_date = datetime.fromtimestamp(
            bill["dueDate"] / 1000
        )  # Convert from milliseconds
        days_until_due = (due_date - now).days

        bill_info = {
            "payee": bill["payee"],
            "amount": bill["amount"],
            "due_date": due_date.isoformat(),
            "days_until_due": days_until_due,
            "paid": bill.get("paid", False),
        }

        if not bill.get("paid", False):
            if days_until_due < 0:
                overdue_bills.append(bill_info)
            elif days_until_due <= 7:
                upcoming_bills.append(bill_info)

    # Sort upcoming bills by due date
    upcoming_bills.sort(key=lambda x: x["days_until_due"])
    overdue_bills.sort(key=lambda x: x["days_until_due"])

    return {
        "upcoming_bills": upcoming_bills,
        "overdue_bills": overdue_bills,
        "total_upcoming": round(sum(bill["amount"] for bill in upcoming_bills), 2),
        "total_overdue": round(sum(bill["amount"] for bill in overdue_bills), 2),
    }


def _detect_spending_anomalies(expenses_df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Detect potential anomalies in spending patterns."""
    if (
        expenses_df.empty or len(expenses_df) < 10
    ):  # Need enough data for meaningful analysis
        return []

    anomalies = []

    # Large transactions (above 2 standard deviations from mean)
    mean_amount = expenses_df["amount"].mean()
    std_amount = expenses_df["amount"].std()
    threshold = mean_amount + 2 * std_amount

    large_transactions = expenses_df[expenses_df["amount"] > threshold].sort_values(
        "amount", ascending=False
    )

    for _, row in large_transactions.iterrows():
        anomalies.append(
            {
                "type": "large_transaction",
                "description": row["description"],
                "amount": round(row["amount"], 2),
                "date": row["date"].isoformat() if not pd.isna(row["date"]) else None,
                "category": row["category"],
                "deviation": round((row["amount"] - mean_amount) / std_amount, 2),
            }
        )

    # Unusual category spending
    if "month" in expenses_df.columns and "category" in expenses_df.columns:
        category_monthly = expenses_df.pivot_table(
            index="month",
            columns="category",
            values="amount",
            aggfunc="sum",
            fill_value=0,
        )

        for category in category_monthly.columns:
            if len(category_monthly[category]) >= 3:  # Need at least 3 months of data
                category_values = category_monthly[category].values
                category_mean = category_values[:-1].mean()  # Exclude the latest month
                category_std = category_values[:-1].std()

                if category_std > 0:  # Avoid division by zero
                    latest_value = category_values[-1]
                    z_score = (latest_value - category_mean) / category_std

                    if z_score > 2:  # More than 2 standard deviations above
                        anomalies.append(
                            {
                                "type": "category_increase",
                                "category": category,
                                "current_amount": round(latest_value, 2),
                                "average_amount": round(category_mean, 2),
                                "increase_percentage": round(
                                    ((latest_value / category_mean) - 1) * 100, 2
                                ),
                                "z_score": round(z_score, 2),
                            }
                        )

    return anomalies


def _calculate_percentage_change(previous: float, current: float) -> float:
    """Calculate the percentage change between two values."""
    if previous == 0:
        return 0
    return round(((current - previous) / abs(previous)) * 100, 2)


def calculate_and_store_all_insights(db, user_id: str) -> Dict[str, Any]:
    """
    Calculate insights from raw data and store them into the database.
    """
    insights = calculate_insights_for_user(user_id)
    if not insights:
        return {}

    # Store insights in MongoDB
    mongo_db = get_mongo_db()

    # Create or update document in insights collection
    insight_doc = {
        "userId": user_id,
        "data": insights,
        "generatedAt": datetime.now(),
        "updatedAt": datetime.now(),
    }

    # Upsert the document
    mongo_db.insights.update_one(
        {"userId": user_id}, {"$set": insight_doc}, upsert=True
    )

    return insights


def get_stored_insights_for_user(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve previously calculated insights for a user.
    Returns None if no insights are found.
    """
    mongo_db = get_mongo_db()
    insight_doc = mongo_db.insights.find_one({"userId": user_id})
    return insight_doc["data"] if insight_doc else None
