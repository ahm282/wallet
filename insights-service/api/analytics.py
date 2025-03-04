from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from config.database import get_db
from services.insights import (
    calculate_insights_for_user,
    get_stored_insights_for_user,
    calculate_and_store_all_insights,
)

router = APIRouter()


@router.get("/")
async def get_insights():
    return {"message": "Analytics and insights endpoint"}


@router.get("/{user_id}", response_model=dict)
async def get_user_insights(
    user_id: str,
    refresh: bool = Query(False, description="Force recalculation of insights"),
    db: Session = Depends(get_db),
):
    """
    Get financial insights for a specific user.
    If refresh=True, recalculates insights from raw data.
    Otherwise tries to fetch stored insights first.
    """
    # Try to get stored insights first (if not forcing refresh)
    if not refresh:
        stored_insights = get_stored_insights_for_user(user_id)
        if stored_insights:
            return stored_insights

    # Calculate new insights
    insights = calculate_and_store_all_insights(db, user_id)
    if not insights:
        raise HTTPException(
            status_code=404, detail="No transactions found for this user"
        )
    return insights


@router.get("/summary/{user_id}", response_model=dict)
async def get_summary_insights(user_id: str, db: Session = Depends(get_db)):
    """Get only the summary section of insights for a user"""
    insights = get_stored_insights_for_user(user_id)
    if not insights or "summary" not in insights:
        # If no stored insights, calculate them
        insights = calculate_insights_for_user(user_id)
        if not insights:
            raise HTTPException(
                status_code=404, detail="No transactions found for this user"
            )

    return {"summary": insights["summary"]}


@router.get("/categories/{user_id}", response_model=dict)
async def get_category_insights(user_id: str, db: Session = Depends(get_db)):
    """Get category breakdown insights for a user"""
    insights = get_stored_insights_for_user(user_id)
    if not insights or "category_breakdown" not in insights:
        insights = calculate_insights_for_user(user_id)
        if not insights:
            raise HTTPException(
                status_code=404, detail="No transactions found for this user"
            )

    return {"category_breakdown": insights["category_breakdown"]}


@router.get("/budget/{user_id}", response_model=dict)
async def get_budget_performance(user_id: str, db: Session = Depends(get_db)):
    """Get budget performance insights for a user"""
    insights = get_stored_insights_for_user(user_id)
    if not insights or "budget_performance" not in insights:
        insights = calculate_insights_for_user(user_id)
        if not insights:
            raise HTTPException(
                status_code=404, detail="No transactions found for this user"
            )

    return {"budget_performance": insights["budget_performance"]}


@router.get("/bills/{user_id}", response_model=dict)
async def get_bill_analysis(user_id: str, db: Session = Depends(get_db)):
    """Get bill analysis insights for a user"""
    insights = get_stored_insights_for_user(user_id)
    if not insights or "bill_analysis" not in insights:
        insights = calculate_insights_for_user(user_id)
        if not insights:
            raise HTTPException(
                status_code=404, detail="No transactions found for this user"
            )

    return {"bill_analysis": insights["bill_analysis"]}


@router.get("/anomalies/{user_id}", response_model=dict)
async def get_spending_anomalies(user_id: str, db: Session = Depends(get_db)):
    """Get spending anomalies for a user"""
    insights = get_stored_insights_for_user(user_id)
    if not insights or "anomalies" not in insights:
        insights = calculate_insights_for_user(user_id)
        if not insights:
            raise HTTPException(
                status_code=404, detail="No transactions found for this user"
            )

    return {"anomalies": insights["anomalies"]}
