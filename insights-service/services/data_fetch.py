from config.database import get_mongo_db


##############
# Accounts
##############
def fetch_accounts_for_user(user_id: str):
    """
    Fetch all accounts for a given user from MongoDB.

    Args:
        user_id: The user ID

    Returns:
        List of account documents
    """
    db = get_mongo_db()
    accounts = list(db.accounts.find({"userId": user_id}))
    return accounts


def fetch_account_by_id(account_id: str):
    """
    Fetch a specific account by its ID from MongoDB.

    Args:
        account_id: The account ID

    Returns:
        Account document or None if not found
    """
    db = get_mongo_db()
    from bson import ObjectId

    return db.accounts.find_one({"_id": ObjectId(account_id)})


##############
# Bills
##############
def fetch_bills_for_user(user_id: str):
    """
    Fetch all bills for a given user from MongoDB.

    Args:
        user_id: The user ID

    Returns:
        List of bill documents
    """
    db = get_mongo_db()
    bills = list(db.bills.find({"userId": user_id}))
    return bills


def fetch_bill_by_id(bill_id: str):
    """
    Fetch a specific bill by its ID from MongoDB.

    Args:
        bill_id: The bill ID

    Returns:
        Bill document or None if not found
    """
    db = get_mongo_db()
    from bson import ObjectId

    return db.bills.find_one({"_id": ObjectId(bill_id)})


##############
# Budgets
##############
def fetch_budgets_for_user(user_id: str):
    """
    Fetch all budgets for a given user from MongoDB.

    Args:
        user_id: The user ID

    Returns:
        List of budget documents
    """
    db = get_mongo_db()
    budgets = list(db.budgets.find({"userId": user_id}))
    return budgets


def fetch_budget_by_id(budget_id: str):
    """
    Fetch a specific budget by its ID from MongoDB.

    Args:
        budget_id: The budget ID

    Returns:
        Budget document or None if not found
    """
    db = get_mongo_db()
    from bson import ObjectId

    return db.budgets.find_one({"_id": ObjectId(budget_id)})


##############
# Goals
##############
def fetch_goals_for_user(user_id: str):
    """
    Fetch all goals for a given user from MongoDB.

    Args:
        user_id: The user ID

    Returns:
        List of goal documents
    """
    db = get_mongo_db()
    goals = list(db.goals.find({"userId": user_id}))
    return goals


def fetch_goal_by_id(goal_id: str):
    """
    Fetch a specific goal by its ID from MongoDB.

    Args:
        goal_id: The goal ID

    Returns:
        Goal document or None if not found
    """
    db = get_mongo_db()
    from bson import ObjectId

    return db.goals.find_one({"_id": ObjectId(goal_id)})


##############
# Transactions
##############
def fetch_transactions_for_user(user_id: str):
    """
    Fetch all transactions for a given user from MongoDB.

    Args:
        user_id: The user ID

    Returns:
        List of transaction documents
    """
    db = get_mongo_db()
    transactions = list(db.transactions.find({"userId": user_id}))
    return transactions


def fetch_transaction_by_id(transaction_id: str):
    """
    Fetch a transaction from MongoDB by its ID.
    """
    db = get_mongo_db()
    return db.transactions.find_one({"_id": transaction_id})
