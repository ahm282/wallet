from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from config.database import get_db
from services.predictions import (
    predict_income_for_user,
    predict_spending_for_user,
    predict_cashflow_for_user,
    predict_goal_completion,
    detect_anomalous_transactions,
    predict_account_balances,
    save_prediction_history,
    evaluate_prediction_accuracy,
    calculate_and_store_all_predictions,
    get_stored_predictions_for_user,
)

router = APIRouter()


# predictions endpoints
@router.get("/")
async def get_predictions():
    return {"message": "Predictions endpoint"}


@router.get("/{user_id}", response_model=dict)
async def get_user_predictions(
    user_id: str, refresh: bool = Query(False), db: Session = Depends(get_db)
):
    """
    Get financial predictions for a specific user.
    If refresh=True, recalculates predictions from raw data.
    Otherwise tries to fetch stored predictions first.
    """
    predictions = None

    # Try to get stored predictions first (if not forcing refresh)
    if not refresh:
        stored_predictions = get_stored_predictions_for_user(user_id)
        if stored_predictions:
            return stored_predictions

    # Calculate new predictions
    predictions = calculate_and_store_all_predictions(user_id)

    if predictions is None:
        raise HTTPException(
            status_code=404, detail="No transactions found for this user"
        )
    return predictions


# New AI prediction endpoints
@router.get("/predict/income/{user_id}", response_model=Dict[str, Any])
async def predict_user_income(user_id: str, db: Session = Depends(get_db)):
    """Predict future income patterns for a user"""
    try:
        predictions = predict_income_for_user(user_id)
        # Save prediction history for later evaluation
        save_prediction_history(user_id, "income", predictions)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/predict/spending/{user_id}", response_model=Dict[str, Any])
async def predict_user_spending(user_id: str, db: Session = Depends(get_db)):
    """Predict future spending patterns for a user"""
    try:
        predictions = predict_spending_for_user(user_id)
        save_prediction_history(user_id, "spending", predictions)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/predict/cashflow/{user_id}", response_model=Dict[str, Any])
async def predict_user_cashflow(user_id: str, db: Session = Depends(get_db)):
    """Predict future cashflow for a user"""
    try:
        predictions = predict_cashflow_for_user(user_id)
        save_prediction_history(user_id, "cashflow", predictions)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/predict/goals/{user_id}", response_model=List[Dict[str, Any]])
async def predict_goal_complete(user_id: str, db: Session = Depends(get_db)):
    """Predict when financial goals will be completed"""
    try:
        predictions = predict_goal_completion(user_id)
        save_prediction_history(user_id, "goals", {"goals": predictions})
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/predict/balances/{user_id}", response_model=Dict[str, Any])
async def predict_account_balance(
    user_id: str, days: int = Query(365, ge=1, le=365), db: Session = Depends(get_db)
):
    """Predict account balances for specified days into the future"""
    try:
        predictions = predict_account_balances(user_id, days_forward=days)
        save_prediction_history(user_id, "balances", predictions)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/predict/accuracy/{user_id}", response_model=Dict[str, Any])
async def get_prediction_accuracy(user_id: str, db: Session = Depends(get_db)):
    """Evaluate the accuracy of previous predictions"""
    try:
        accuracy = evaluate_prediction_accuracy(user_id)
        return accuracy
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Accuracy evaluation failed: {str(e)}"
        )


@router.get("/anomalies/transactions/{user_id}", response_model=List[Dict[str, Any]])
async def detect_anomalies(user_id: str, db: Session = Depends(get_db)):
    """Detect anomalous transactions using machine learning"""
    try:
        anomalies = detect_anomalous_transactions(user_id)
        return anomalies
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Anomaly detection failed: {str(e)}"
        )
