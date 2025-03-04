import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
from services.data_fetch import (
    fetch_transactions_for_user,
    fetch_accounts_for_user,
    fetch_goals_for_user,
)
from config.database import get_db
from models.simple_ai_model import SimpleAIModel
from util.helpers import model_to_dict
import math


##################
# Predictions
##################
def calculate_and_store_all_predictions(user_id: str):
    """
    Calculate and store all financial predictions for a user.
    """
    try:
        db = next(get_db())
        predictions = {}

        # Income prediction
        income_prediction = predict_income_for_user(user_id)
        save_prediction_history(user_id, "income", income_prediction)
        predictions["income"] = income_prediction

        # Spending prediction
        spending_prediction = predict_spending_for_user(user_id)
        save_prediction_history(user_id, "spending", spending_prediction)
        predictions["spending"] = spending_prediction

        # Cashflow prediction
        cashflow_prediction = predict_cashflow_for_user(user_id)
        save_prediction_history(user_id, "cashflow", cashflow_prediction)
        predictions["cashflow"] = cashflow_prediction

        # Goal completion prediction
        goal_predictions = predict_goal_completion(user_id)
        save_prediction_history(user_id, "goals", {"goals": goal_predictions})
        predictions["goals"] = goal_predictions

        return predictions
    except Exception as e:
        print(f"Error calculating and storing predictions: {e}")
        return None


def get_stored_predictions_for_user(user_id: str) -> Dict[str, Any]:
    """
    Get stored financial predictions for a user.
    """
    try:
        db = next(get_db())
        predictions = {}

        # Income prediction
        income_prediction = get_stored_prediction(user_id, "income")
        predictions["income"] = income_prediction

        # Spending prediction
        spending_prediction = get_stored_prediction(user_id, "spending")
        predictions["spending"] = spending_prediction

        # Cashflow prediction
        cashflow_prediction = get_stored_prediction(user_id, "cashflow")
        predictions["cashflow"] = cashflow_prediction

        # Goal completion prediction
        goal_predictions = get_stored_prediction(user_id, "goals")
        predictions["goals"] = goal_predictions

        return predictions
    except Exception as e:
        print(f"Error fetching stored predictions: {e}")
        return None


def get_stored_prediction(user_id: str, prediction_type: str) -> Dict[str, Any]:
    """
    Get stored prediction for a user and prediction type.
    """
    try:
        db = next(get_db())
        from config.database import income_prediction_repository
        from config.database import spending_prediction_repository
        from config.database import cash_flow_repository

        if prediction_type == "income":
            prediction = income_prediction_repository.get_latest_for_user(db, user_id)
        elif prediction_type == "spending":
            prediction = spending_prediction_repository.get_latest_for_user(db, user_id)
        elif prediction_type == "cashflow":
            prediction = cash_flow_repository.get_latest_for_user(db, user_id)
        else:
            prediction = None

        if prediction:
            return model_to_dict(prediction)
        else:
            return {}
    except Exception as e:
        print(f"Error fetching stored prediction: {e}")
        return {}


def predict_income_for_user(user_id: str) -> Dict[str, Any]:
    """
    Predict future income for a user based on their transaction history.
    Uses a simple regression model to forecast next month's income.
    """
    transactions = fetch_transactions_for_user(user_id)
    if not transactions:
        return {
            "predicted_income": None,
            "confidence": 0,
            "details": "Insufficient data",
        }

    # Process transaction data
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], unit="ms", errors="coerce")
    df["month"] = df["date"].dt.to_period("M")

    # Filter for income transactions
    income_df = df[df["amount"] > 0].copy()

    if income_df.empty or len(income_df["month"].unique()) < 2:
        return {
            "predicted_income": None,
            "confidence": 0,
            "details": "Insufficient income history",
        }

    # Aggregate by month
    monthly_income = income_df.groupby("month")["amount"].sum().reset_index()
    monthly_income["month_num"] = range(1, len(monthly_income) + 1)

    # Prepare features - we'll use a simple time-based approach
    X = monthly_income[["month_num"]].values
    y = monthly_income["amount"].values

    # Initialize model
    model = SimpleAIModel(model_type="linear")
    model_path = f"./AI_models/income_{user_id}.joblib"

    # Try to load existing model, or train a new one
    if not model.load(model_path):
        model.fit(X, y)
        model.save(model_path)

    # Predict next month
    next_month = len(monthly_income) + 1
    predicted_income = float(model.predict([[next_month]])[0])

    # Calculate confidence based on historical variance
    if len(y) >= 3:
        income_std = np.std(y)
        income_mean = np.mean(y)
        coefficient_variation = income_std / income_mean if income_mean > 0 else 1
        confidence = max(0, min(100, 100 * (1 - coefficient_variation)))
    else:
        confidence = 50  # Default medium confidence with limited data

    # Get recent trends for context
    if len(monthly_income) >= 2:
        last_month = monthly_income.iloc[-1]["amount"]
        previous_month = monthly_income.iloc[-2]["amount"]
        trend_pct = (
            ((last_month - previous_month) / previous_month * 100)
            if previous_month > 0
            else 0
        )
    else:
        trend_pct = 0

    # Adjust prediction if it's negative (unlikely for income)
    predicted_income = max(0, predicted_income)

    return {
        "predicted_income": round(predicted_income, 2),
        "confidence": round(confidence, 2),
        "forecast_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
        "historical_avg": round(float(np.mean(y)), 2),
        "trend_percentage": round(trend_pct, 2),
        "data_points_used": len(monthly_income),
    }


def predict_spending_for_user(user_id: str) -> Dict[str, Any]:
    """
    Predict future spending for a user based on their transaction history.
    Provides overall spending prediction and category-specific predictions.
    """
    transactions = fetch_transactions_for_user(user_id)
    if not transactions:
        return {
            "predicted_spending": None,
            "confidence": 0,
            "details": "Insufficient data",
        }

    # Process transaction data
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], unit="ms", errors="coerce")
    df["month"] = df["date"].dt.to_period("M")

    # Filter for expense transactions
    expense_df = df[df["amount"] < 0].copy()
    expense_df["amount"] = abs(expense_df["amount"])  # Make positive for analysis

    if expense_df.empty or len(expense_df["month"].unique()) < 2:
        return {
            "predicted_spending": None,
            "confidence": 0,
            "details": "Insufficient spending history",
        }

    # Aggregate by month
    monthly_spending = expense_df.groupby("month")["amount"].sum().reset_index()
    monthly_spending["month_num"] = range(1, len(monthly_spending) + 1)

    # Prepare data for model
    X = monthly_spending[["month_num"]].values
    y = monthly_spending["amount"].values

    # Train model
    model = SimpleAIModel(model_type="forest")
    model_path = f"./AI_models/spending_{user_id}.joblib"

    if not model.load(model_path):
        model.fit(X, y)
        model.save(model_path)

    # Predict next month's spending
    next_month = len(monthly_spending) + 1
    predicted_spending = float(model.predict([[next_month]])[0])

    # Calculate confidence based on historical data
    if len(y) >= 3:
        spending_std = np.std(y)
        spending_mean = np.mean(y)
        coefficient_variation = spending_std / spending_mean if spending_mean > 0 else 1
        confidence = max(
            0, min(95, 95 * (1 - coefficient_variation))
        )  # Cap at 95% confidence
    else:
        confidence = 40  # Lower default confidence for spending

    # Category predictions
    category_predictions = {}
    if "category" in expense_df.columns:
        top_categories = (
            expense_df.groupby("category")["amount"].sum().nlargest(5).index.tolist()
        )

        for category in top_categories:
            cat_df = expense_df[expense_df["category"] == category]
            cat_monthly = cat_df.groupby("month")["amount"].sum().reset_index()

            if len(cat_monthly) >= 2:
                cat_monthly["month_num"] = range(1, len(cat_monthly) + 1)
                cat_X = cat_monthly[["month_num"]].values
                cat_y = cat_monthly["amount"].values

                cat_model = SimpleAIModel(model_type="linear")
                cat_model.fit(cat_X, cat_y)

                cat_next_month = len(cat_monthly) + 1
                cat_prediction = float(cat_model.predict([[cat_next_month]])[0])

                # Ensure prediction is non-negative
                cat_prediction = max(0, cat_prediction)

                # Calculate average and trend
                cat_avg = np.mean(cat_y)
                if len(cat_monthly) >= 2:
                    last_month = cat_monthly.iloc[-1]["amount"]
                    prev_month = cat_monthly.iloc[-2]["amount"]
                    if prev_month > 0:
                        cat_trend = ((last_month - prev_month) / prev_month) * 100
                    else:
                        cat_trend = 0
                else:
                    cat_trend = 0

                category_predictions[category] = {
                    "predicted": round(cat_prediction, 2),
                    "average": round(float(cat_avg), 2),
                    "trend_percentage": round(float(cat_trend), 2),
                }

    # Ensure prediction is non-negative
    predicted_spending = max(0, predicted_spending)

    # Get trend information
    if len(monthly_spending) >= 2:
        last_month = monthly_spending.iloc[-1]["amount"]
        previous_month = monthly_spending.iloc[-2]["amount"]
        if previous_month > 0:
            trend_pct = ((last_month - previous_month) / previous_month) * 100
        else:
            trend_pct = 0
    else:
        trend_pct = 0

    return {
        "predicted_spending": round(predicted_spending, 2),
        "confidence": round(confidence, 2),
        "forecast_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
        "historical_avg": round(float(np.mean(y)), 2),
        "trend_percentage": round(trend_pct, 2),
        "category_predictions": category_predictions,
        "data_points_used": len(monthly_spending),
    }


def predict_cashflow_for_user(user_id: str) -> Dict[str, Any]:
    """
    Predict future cash flow by combining income and spending predictions.
    """
    income_prediction = predict_income_for_user(user_id)
    spending_prediction = predict_spending_for_user(user_id)

    if (
        income_prediction.get("predicted_income") is None
        or spending_prediction.get("predicted_spending") is None
    ):
        return {
            "predicted_cashflow": None,
            "confidence": 0,
            "details": "Insufficient data for reliable prediction",
        }

    predicted_income = income_prediction["predicted_income"]
    predicted_spending = spending_prediction["predicted_spending"]
    predicted_cashflow = predicted_income - predicted_spending

    # Average confidence from both predictions, weighted slightly toward the lower one
    min_conf = min(income_prediction["confidence"], spending_prediction["confidence"])
    max_conf = max(income_prediction["confidence"], spending_prediction["confidence"])
    blended_confidence = (min_conf * 0.7) + (max_conf * 0.3)

    return {
        "predicted_cashflow": round(predicted_cashflow, 2),
        "predicted_income": round(predicted_income, 2),
        "predicted_spending": round(predicted_spending, 2),
        "confidence": round(blended_confidence, 2),
        "forecast_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
        "prediction_type": "positive" if predicted_cashflow > 0 else "negative",
    }


def predict_goal_completion(user_id: str) -> List[Dict[str, Any]]:
    """
    Predict when financial goals will be completed based on current progress and predicted cashflow.
    Returns a list of predictions for each goal with the following keys:
        - goal_id: str
        - goal_name: str
        - target_date: Unix epoch date (seconds)
        - estimated_monthly_contribution: float
        - remaining_amount: float
        - probability: float
        - progress_percentage: float
        - days_until_target: int
    """
    # Fetch the user's goals and predicted cashflow
    goals = fetch_goals_for_user(user_id)
    cashflow_predictions = predict_cashflow_for_user(user_id)

    if not goals:
        return []

    # Extract predicted cashflow and ensure we only consider positive values for saving
    predicted_cashflow = cashflow_predictions.get("predicted_cashflow", 0)
    monthly_positive_cashflow = max(0, predicted_cashflow)

    goal_predictions = []
    today = datetime.now()

    for goal in goals:
        goal_id = str(goal.get("_id", ""))
        goal_name = goal.get("name", "")
        target_amount = goal.get("targetAmount", 0)
        current_amount = goal.get("currentAmount", 0)
        remaining_amount = target_amount - current_amount
        progress_percentage = (
            (current_amount / target_amount * 100) if target_amount != 0 else 0
        )

        # Parse target_date (assumed stored in milliseconds)
        target_date = datetime.fromtimestamp(goal["targetDate"] / 1000)
        days_until_target = (target_date - today).days

        # Determine allocation factor based on current progress toward the goal.
        if current_amount < 0.5 * target_amount:
            allocation_factor = 0.15  # less commitment early on
        elif current_amount > 0.8 * target_amount:
            allocation_factor = 0.25  # ramp up contributions when near completion
        else:
            allocation_factor = 0.20

        estimated_monthly_contribution = monthly_positive_cashflow * allocation_factor

        # If no positive cashflow is available, use fallback estimation.
        if estimated_monthly_contribution <= 0:
            if days_until_target > 0:
                # Distribute the remaining amount evenly over the remaining period.
                estimated_monthly_contribution = remaining_amount / (
                    days_until_target / 30
                )
                predicted_completion = target_date
                # Lower baseline probability if predicted cashflow is negative.
                probability = 0.3 if predicted_cashflow < 0 else 0.5
            else:
                estimated_monthly_contribution = 0
                predicted_completion = target_date
                probability = 0.0
        else:
            # Estimate the months needed based on the available contribution.
            months_needed = remaining_amount / estimated_monthly_contribution
            predicted_completion = today + timedelta(days=int(months_needed * 30))

            if predicted_completion <= target_date:
                probability = 0.9
            else:
                # Calculate delay and compute a delay ratio relative to days until target.
                delay = (predicted_completion - target_date).days
                delay_ratio = (
                    delay / days_until_target if days_until_target > 0 else 1.0
                )
                # Apply exponential decay to reduce probability with increasing delay.
                probability = 0.9 * math.exp(-delay_ratio)
                probability = max(0.3, min(probability, 0.9))

        goal_predictions.append(
            {
                "goal_id": goal_id,
                "goal_name": goal_name,
                "target_date": int(target_date.timestamp()),
                "estimated_monthly_contribution": round(
                    estimated_monthly_contribution, 2
                ),
                "remaining_amount": round(remaining_amount, 2),
                "probability": round(probability, 2),
                "progress_percentage": round(progress_percentage, 2),
                "days_until_target": days_until_target,
            }
        )

    return goal_predictions


def predict_account_balances(user_id: str, days_forward=30) -> Dict[str, Any]:
    """
    Predict future account balances based on cashflow predictions.
    """
    accounts = fetch_accounts_for_user(user_id)
    cashflow = predict_cashflow_for_user(user_id)

    if not accounts:
        return {"message": "No accounts found"}

    # Get total current balance across all accounts
    total_current_balance = sum(account.get("balance", 0) for account in accounts)

    # Calculate projected balance directly using days_forward
    total_projected_balance = (
        total_current_balance
        + (cashflow.get("predicted_cashflow", 0) / 30) * days_forward
    )
    projected_date = (datetime.now() + timedelta(days=days_forward)).strftime(
        "%Y-%m-%d"
    )

    # Make individual account predictions
    # This simplified approach distributes cashflow proportionally across accounts
    account_predictions = []
    for account in accounts:
        account_balance = account.get("balance", 0)
        account_ratio = (
            account_balance / total_current_balance if total_current_balance else 0
        )

        # Project forward
        projected_balance = account_balance + (
            cashflow.get("predicted_cashflow", 0) * account_ratio * days_forward / 30
        )

        account_predictions.append(
            {
                "account_id": str(account.get("_id", "")),
                "account_name": account.get("name", ""),
                "current_balance": account_balance,
                "projected_balance": round(projected_balance, 2),
                "change": round(projected_balance - account_balance, 2),
                "change_percentage": (
                    round(((projected_balance / account_balance) - 1) * 100, 2)
                    if account_balance
                    else 0
                ),
            }
        )

    return {
        "total_current_balance": round(total_current_balance, 2),
        "total_projected_balance": round(total_projected_balance, 2),
        "projected_date": projected_date,
        "confidence": cashflow.get("confidence", 50),
        "days_forward": days_forward,
        "account_predictions": account_predictions,
    }


##################
# Anomaly Detection
##################
def detect_anomalous_transactions(user_id: str) -> List[Dict[str, Any]]:
    """
    Use Isolation Forest to detect unusual and anomalous transactions that might represent atypical spending.
    """
    transactions = fetch_transactions_for_user(user_id)
    list_of_transactions = list(transactions)
    if (
        not transactions or len(list_of_transactions) < 20
    ):  # Require a reasonable amount of data
        return []

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], unit="ms", errors="coerce")

    # Focus on expenses
    expense_df = df[df["amount"] < 0].copy()
    expense_df["amount"] = abs(expense_df["amount"])  # Make positive for analysis

    if len(expense_df) < 10:
        return []

    # Feature engineering for anomaly detection
    expense_df["day_of_week"] = expense_df["date"].dt.dayofweek
    expense_df["day_sin"] = np.sin(expense_df["day_of_week"] * (2 * np.pi / 7))
    expense_df["day_cos"] = np.cos(expense_df["day_of_week"] * (2 * np.pi / 7))
    expense_df["hour"] = expense_df["date"].dt.hour
    expense_df["hour_sin"] = np.sin(expense_df["hour"] * (2 * np.pi / 24))
    expense_df["hour_cos"] = np.cos(expense_df["hour"] * (2 * np.pi / 24))

    # Add month for seasonal spending patterns
    expense_df["month"] = expense_df["date"].dt.month

    # One-hot encode categories if present
    if "category" in expense_df.columns:
        expense_df = pd.get_dummies(expense_df, columns=["category"], prefix="cat")

    # Select features for anomaly detection
    features = ["amount", "day_sin", "day_cos", "hour_sin", "hour_cos"]
    cat_features = [col for col in expense_df.columns if col.startswith("cat_")]
    features.extend(cat_features)

    # Prepare data: drop rows with missing feature values
    X = expense_df[features].dropna()
    if len(X) < 10:
        return []

    # Train or load Isolation Forest model
    model = SimpleAIModel(model_type="anomaly")
    model_path = f"./AI_models/anomaly_{user_id}.joblib"
    if not model.load(model_path):
        model.fit(X)
        model.save(model_path)

    # Predict anomaly scores (Isolation Forest produces negative scores for outliers)
    anomaly_scores = model.predict(X)

    # Determine threshold for anomalies
    sorted_scores = np.sort(anomaly_scores)
    lowest_10_percent = np.percentile(sorted_scores, 10)

    anomaly_threshold = -0.3
    max_extreme_raw = lowest_10_percent

    anomaly_indices = np.where(anomaly_scores < anomaly_threshold)[0]

    if len(anomaly_indices) == 0:
        return []

    # Extract anomalous transactions
    anomalies = []
    for pos, idx_pos in enumerate(anomaly_indices):
        if idx_pos >= len(X.index):
            continue
        idx = X.index[idx_pos]
        if idx >= len(expense_df):
            continue

        transaction = expense_df.iloc[idx]
        raw_score = anomaly_scores[idx_pos]

        # Map the raw score to a percentage (0-100, linear)
        if raw_score > anomaly_threshold:
            mapped_score = 0
        else:
            mapped_score = (
                (anomaly_threshold - raw_score) / (anomaly_threshold - max_extreme_raw)
            ) * 100

        anomaly_score = min(100, max(0, math.sqrt(mapped_score) * 10))

        # Create metrics for anomaly reasoning
        metrics = _compute_anomaly_metrics(transaction, expense_df)

        # Calculate a combined anomaly score that considers multiple factors to not depend solely on the Isolation Forest score
        factor_weights = {
            "model_score": 0.5,  # Weight of the Isolation Forest score
            "amount_z_score": 0.2,  # How unusual is the amount
            "time_rarity": 0.1,  # How unusual is the time of day/week
            "category_rarity": 0.1,  # How rare is this category
            "merchant_rarity": 0.1,  # How rare is this merchant
        }

        # Calculate the factor scores (all between 0-100)
        factor_scores = {
            "model_score": mapped_score,
            "amount_z_score": min(100, max(0, abs(metrics["amount"]["z_score"]) * 25)),
            "time_rarity": min(
                100,
                max(
                    0,
                    (metrics["time"]["hour_rarity"] + metrics["time"]["day_rarity"])
                    * 50,
                ),
            ),
            "category_rarity": (
                min(100, max(0, metrics["category"].get("category_rarity", 0) * 100))
                if metrics["category"]
                else 0
            ),
            "merchant_rarity": min(
                100, max(0, metrics["frequency"]["merchant_rarity"] * 100)
            ),
        }

        # Apply weights to each factor
        combined_score = sum(
            factor_weights[k] * factor_scores[k] for k in factor_weights
        )

        # Make sure the combined score is between 0-100
        anomaly_score = round(min(100, max(0, combined_score)))

        anomalies.append(
            {
                "transaction_id": str(transaction.get("_id", "")),
                "date": (
                    transaction["date"].isoformat()
                    if not pd.isna(transaction["date"])
                    else None
                ),
                "amount": round(transaction["amount"], 2),
                "description": transaction.get("description", ""),
                "category": transaction.get("category", "Unknown"),
                "anomaly_score": round(anomaly_score, 2),
                "reason": _determine_anomaly_reason(transaction, expense_df, metrics),
                "metrics": metrics,
            }
        )

    # Sort anomalies by score (highest anomalous score first)
    anomalies.sort(key=lambda x: x["anomaly_score"], reverse=True)
    # Return up to 10 anomalies
    return anomalies[:10]


def _compute_anomaly_metrics(transaction, expense_df):
    """
    Compute detailed metrics about why a transaction might be anomalous.
    Returns a dictionary of metrics that can be used for reasoning.
    """
    amount = transaction["amount"]

    # Amount-related statistics
    amount_stats = {
        "transaction_amount": amount,
        "avg_amount": round(expense_df["amount"].mean(), 2),
        "median_amount": round(expense_df["amount"].median(), 2),
        "std_amount": round(expense_df["amount"].std(), 2),
        "percentile": round(100 * (expense_df["amount"] <= amount).mean()),
        "z_score": round(
            (
                (amount - expense_df["amount"].mean()) / expense_df["amount"].std()
                if expense_df["amount"].std() > 0
                else 0
            ),
            5,
        ),
    }

    # Time-related statistics
    hour = transaction["date"].hour
    day = transaction["date"].dayofweek
    month = transaction["date"].month

    # Compute hour frequency
    hour_freq = expense_df["hour"].value_counts(normalize=True)
    hour_rarity = 1 - hour_freq.get(hour, 0)

    # Compute day frequency
    day_freq = expense_df["day_of_week"].value_counts(normalize=True)
    day_rarity = 1 - day_freq.get(day, 0)

    # Compute month seasonality
    month_freq = expense_df["month"].value_counts(normalize=True)
    month_rarity = 1 - month_freq.get(month, 0)

    time_stats = {
        "hour": hour,
        "day_of_week": day,
        "month": month,
        "hour_rarity": round(hour_rarity, 2),
        "day_rarity": round(day_rarity, 2),
        "month_rarity": round(month_rarity, 2),
        "is_weekend": day >= 5,
        "is_business_hours": 9 <= hour <= 17,
        "is_late_night": hour < 6 or hour > 22,
    }

    # Category-related statistics
    category_stats = {}
    if "category" in transaction:
        category = transaction["category"]
        if "category" in expense_df.columns:
            cat_freq = expense_df["category"].value_counts(normalize=True)
            category_stats = {
                "category": category,
                "category_frequency": cat_freq.get(category, 0),
                "category_rarity": 1 - cat_freq.get(category, 0),
                "is_rare_category": cat_freq.get(category, 0) < 0.05,
            }

            # Category-specific amount statistics
            cat_df = expense_df[expense_df["category"] == category]
            if len(cat_df) > 0:
                category_stats.update(
                    {
                        "cat_avg_amount": round(cat_df["amount"].mean(), 2),
                        "cat_median_amount": round(cat_df["amount"].median(), 2),
                        "cat_std_amount": round(cat_df["amount"].std(), 2),
                        "cat_percentile": round(
                            (
                                100 * (cat_df["amount"] <= amount).mean()
                                if len(cat_df) > 1
                                else 50
                            ),
                        ),
                        "cat_z_score": round(
                            (
                                (amount - cat_df["amount"].mean())
                                / cat_df["amount"].std()
                                if cat_df["amount"].std() > 0 and len(cat_df) > 1
                                else 0
                            ),
                            4,
                        ),
                    }
                )

    # Frequency statistics
    merchant = transaction.get("description", "").strip().lower()
    merchant_freq = 0
    if merchant:
        merchant_counts = (
            expense_df["description"]
            .str.strip()
            .str.lower()
            .value_counts(normalize=True)
        )
        merchant_freq = merchant_counts.get(merchant, 0)

    frequency_stats = {
        "merchant": merchant,
        "merchant_frequency": round(merchant_freq, 2),
        "merchant_rarity": round(1 - merchant_freq),
        "is_rare_merchant": bool(merchant_freq < 0.03),
    }

    return {
        "amount": amount_stats,
        "time": time_stats,
        "category": category_stats,
        "frequency": frequency_stats,
    }


def _determine_anomaly_reason(transaction, expense_df, metrics=None):
    """
    Provide detailed reasoning about why a transaction was flagged as unusual.

    Returns a list of specific reasons with contextual details about:
        - Amount anomalies (compared to overall spending and category-specific spending)
        - Timing anomalies (unusual hours, days, or seasonal patterns)
        - Category anomalies (rare categories or unusual amounts within a category)
        - Merchant anomalies (rare merchants or unusual spending at a specific merchant)
    """
    reasons = []

    # Use pre-computed metrics if available, otherwise compute them
    if metrics is None:
        metrics = _compute_anomaly_metrics(transaction, expense_df)

    # Amount-based anomalies (with specific thresholds and context)
    amount = metrics["amount"]["transaction_amount"]
    avg_amount = metrics["amount"]["avg_amount"]
    median_amount = metrics["amount"]["median_amount"]
    std_amount = metrics["amount"]["std_amount"]
    z_score = metrics["amount"]["z_score"]
    percentile = metrics["amount"]["percentile"]

    # Add specific amount-related reasons with context
    if z_score > 3:
        reasons.append(
            f"Expense of ${amount:.2f} is extremely high (top {100-percentile:.1f}%, {z_score:.1f}× standard deviation from average)"
        )
    elif z_score > 2:
        reasons.append(
            f"Expense of ${amount:.2f} is unusually high (top {100-percentile:.1f}%, {z_score:.1f}× standard deviation from average)"
        )
    elif amount > 3 * median_amount:
        reasons.append(
            f"Expense of ${amount:.2f} is {amount/median_amount:.1f}× higher than your median expense of ${median_amount:.2f}"
        )

    # Check category-specific anomalies
    if "category" in metrics and metrics["category"]:
        category = metrics["category"]["category"]
        if "cat_z_score" in metrics["category"]:
            cat_z_score = metrics["category"]["cat_z_score"]
            cat_percentile = metrics["category"]["cat_percentile"]
            cat_avg = metrics["category"]["cat_avg_amount"]

            if cat_z_score > 2.5:
                reasons.append(
                    f"Expense of ${amount:.2f} is unusually high for '{category}' category (top {100-cat_percentile:.1f}%, {cat_z_score:.1f}× standard deviation above category average of ${cat_avg:.2f})"
                )

        # Check if this is a rare category
        if metrics["category"]["is_rare_category"]:
            cat_freq = metrics["category"]["category_frequency"]
            reasons.append(
                f"'{category}' is an uncommon category for you (only {cat_freq*100:.1f}% of your transactions)"
            )

    # Time-based anomalies
    hour = metrics["time"]["hour"]
    day = metrics["time"]["day_of_week"]
    is_weekend = metrics["time"]["is_weekend"]
    is_late_night = metrics["time"]["is_late_night"]
    hour_rarity = metrics["time"]["hour_rarity"]
    day_rarity = metrics["time"]["day_rarity"]

    # Add specific time-related reasons
    if is_late_night and hour_rarity > 0.8:
        time_str = f"{hour}:00" if hour <= 12 else f"{hour-12}:00 PM"
        reasons.append(
            f"Unusual transaction time ({time_str}) - you rarely make purchases at this hour"
        )

    if is_weekend and day_rarity > 0.7:
        day_names = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        reasons.append(
            f"Unusual transaction day ({day_names[day]}) - you don't often make purchases on this day"
        )

    # Merchant-based anomalies
    if metrics["frequency"]["is_rare_merchant"]:
        merchant = metrics["frequency"]["merchant"]
        merchant_freq = metrics["frequency"]["merchant_frequency"]
        if merchant and len(merchant) > 3:  # Avoid empty or very short merchant names
            reasons.append(
                f"Uncommon merchant '{merchant}' (only {merchant_freq*100:.1f}% of your transactions)"
            )

    # Monthly/seasonal anomalies
    month_rarity = metrics["time"]["month_rarity"]
    month = metrics["time"]["month"]
    month_names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    if month_rarity > 0.8:
        reasons.append(
            f"Unusual spending in {month_names[month-1]} - you don't typically spend as much during this month"
        )

    # If no specific reason was found, provide a generic message with some context
    if not reasons:
        if z_score > 1.5:
            reasons.append(
                f"Transaction deviates from your typical spending patterns (${amount:.2f} vs average ${avg_amount:.2f})"
            )
        else:
            reasons.append(
                "Multiple minor factors combine to make this transaction unusual"
            )

    return reasons


##################
# Save to DB
##################
def save_prediction_history(
    user_id: str, prediction_type: str, prediction_data: Dict[str, Any]
) -> bool:
    """
    Save prediction history for tracking accuracy over time.
    Delegates to specialized functions based on prediction type.
    """
    try:
        # First, ensure the user exists in PostgreSQL
        db = next(get_db())
        from models.psql.user import User
        from config.database import user_repository

        # Check if user exists
        user = user_repository.get_by_id(db, user_id)
        if not user:
            # Create user if doesn't exist
            new_user = User(id=user_id)
            user_repository.create(db, new_user)

        # Now delegate to the appropriate function
        if prediction_type == "income":
            return save_income_prediction(user_id, prediction_data)
        elif prediction_type == "spending":
            return save_spending_prediction(user_id, prediction_data)
        elif prediction_type == "cashflow":
            return save_cashflow_prediction(user_id, prediction_data)
        elif prediction_type == "goals":
            return save_goals_prediction(user_id, prediction_data)
        elif prediction_type == "balances":
            return save_balance_prediction(user_id, prediction_data)
        else:
            print(f"Unsupported prediction type: {prediction_type}")
            return False
    except Exception as e:
        print(f"Error saving prediction history: {e}")
        return False


def save_income_prediction(user_id: str, prediction_data: Dict[str, Any]) -> bool:
    """Save income prediction to PostgreSQL."""
    try:
        db = next(get_db())
        from models.psql.income_prediction import IncomePrediction
        from config.database import income_prediction_repository

        prediction = IncomePrediction(
            user_id=user_id,
            month=(datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
            predicted_income=prediction_data.get("predicted_income", 0),
            confidence=float(prediction_data.get("confidence", 0)),
            prediction_date=datetime.now(),
        )

        income_prediction_repository.create(db, prediction)
        return True
    except Exception as e:
        print(f"Error saving income prediction: {e}")
        return False


def save_spending_prediction(user_id: str, prediction_data: Dict[str, Any]) -> bool:
    """Save spending prediction to PostgreSQL."""
    try:
        db = next(get_db())
        from models.psql.spending_prediction import SpendingPrediction
        from config.database import spending_prediction_repository

        prediction = SpendingPrediction(
            user_id=user_id,
            month=(datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
            predicted_spending=float(prediction_data.get("predicted_spending", 0)),
            confidence=float(prediction_data.get("confidence", 0)),
            categories=prediction_data.get("category_predictions", {}),
            prediction_date=datetime.now(),
        )
        spending_prediction_repository.create(db, prediction)
        return True
    except Exception as e:
        print(f"Error saving spending prediction: {e}")
        return False


def save_cashflow_prediction(user_id: str, prediction_data: Dict[str, Any]) -> bool:
    """Save cashflow prediction to PostgreSQL."""
    try:
        db = next(get_db())
        from models.psql.cash_flow import CashFlow
        from config.database import cash_flow_repository

        cash_flow = CashFlow(
            user_id=user_id,
            date=datetime.now(),
            income=prediction_data.get("predicted_income", 0),
            expenses=prediction_data.get("predicted_spending", 0),
            net=prediction_data.get("predicted_cashflow", 0),
            period_type="month",
            period_id=(datetime.now() + timedelta(days=30)).strftime("%Y-%m"),
        )

        cash_flow_repository.create(db, cash_flow)
        return True
    except Exception as e:
        print(f"Error saving cashflow prediction: {e}")
        return False


def save_goals_prediction(user_id: str, prediction_data: Dict[str, Any]) -> bool:
    """Save goal predictions to PostgreSQL."""
    try:
        db = next(get_db())
        from models.psql.goal_projection import GoalProjection
        from config.database import goal_projection_repository

        goals = prediction_data.get("goals", [])
        if not goals:
            return True

        for goal_data in goals:
            goal_projection = GoalProjection(
                user_id=user_id,
                goal_id=goal_data.get("goal_id", ""),
                name=goal_data.get("goal_name", ""),
                current=goal_data.get("remaining_amount", 0),
                target=goal_data.get("target_amount", 0),
                projected_completion_date=datetime.fromtimestamp(
                    goal_data.get("target_date", 0)
                ),
                on_track=(goal_data.get("probability", 0) > 0.5),
                percentage_complete=goal_data.get("progress_percentage", 0),
                recommended_monthly_contribution=goal_data.get(
                    "estimated_monthly_contribution", 0
                ),
            )

            goal_projection_repository.create(db, goal_projection)

        return True
    except Exception as e:
        print(f"Error saving goals prediction: {e}")
        return False


def save_balance_prediction(user_id: str, prediction_data: Dict[str, Any]) -> bool:
    """Save account balance predictions to PostgreSQL."""
    try:
        # There's no specific model for balance predictions in the provided code,
        # but we can use an insight record to store this information
        db = next(get_db())
        from models.psql.insight import Insight
        from models.psql.enums import InsightType
        from config.database import insight_repository

        insight = Insight(
            user_id=user_id,
            type=InsightType.INFO,
            message="Account balance prediction",
            relevance_score=0.8,
            data={
                "total_current_balance": prediction_data.get(
                    "total_current_balance", 0
                ),
                "total_projected_balance": prediction_data.get(
                    "total_projected_balance", 0
                ),
                "projected_date": prediction_data.get("projected_date", ""),
                "confidence": prediction_data.get("confidence", 0),
                "predictions": prediction_data.get("daily_predictions", [])[
                    :5
                ],  # Store first 5 days
                "account_predictions": prediction_data.get("account_predictions", []),
            },
            is_read=False,
        )

        insight_repository.create(db, insight)
        return True
    except Exception as e:
        print(f"Error saving balance prediction: {e}")
        return False
