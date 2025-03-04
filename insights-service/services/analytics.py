from services.data_fetch import (
    fetch_accounts_for_user,
    fetch_bills_for_user,
    fetch_budgets_for_user,
    fetch_goals_for_user,
    fetch_transactions_for_user,
)


def calculate_basic_analytics(user_id: str):
    """
    Compute basic analytics by counting key entities for the given user.
    """
    accounts = fetch_accounts_for_user(user_id)
    transactions = fetch_transactions_for_user(user_id)
    bills = fetch_bills_for_user(user_id)
    budgets = fetch_budgets_for_user(user_id)
    goals = fetch_goals_for_user(user_id)

    return {
        "total_accounts": len(accounts),
        "total_transactions": len(transactions),
        "total_bills": len(bills),
        "total_budgets": len(budgets),
        "total_goals": len(goals),
    }


def calculate_category_analytics(transactions):
    """
    Given a list of transaction dicts, compute category-wise analytics such as
    total transactions and average transaction value per category.
    """
    category_totals = {}
    category_counts = {}
    for t in transactions:
        category = t["category"]
        category_totals[category] = category_totals.get(category, 0) + t["amount"]
        category_counts[category] = category_counts.get(category, 0) + 1

    category_averages = {
        category: category_totals[category] / category_counts[category]
        for category in category_totals
    }

    return {
        "category_totals": category_totals,
        "category_averages": category_averages,
    }


def calculate_insights(transactions):
    """
    Given a list of transaction dicts, compute insights based on the transactions.
    """
    basic_analytics = calculate_basic_analytics(transactions)
    category_analytics = calculate_category_analytics(transactions)
    return {
        "basic_analytics": basic_analytics,
        "category_analytics": category_analytics,
    }


def compute_and_store_all_insights(db, user_id):
    """
    Compute and store insights for all transactions of the given user.
    """
    # Replace with your logic to retrieve all transactions for the user.
    transactions = [
        {"amount": 100, "category": "groceries"},
        {"amount": 50, "category": "utilities"},
        {"amount": 200, "category": "groceries"},
        {"amount": 75, "category": "utilities"},
    ]  # Example placeholder
    insights = calculate_insights(transactions)
    # Replace with your logic to store the insights in the database.
    print(f"Insights computed and stored for user {user_id}: {insights}")
