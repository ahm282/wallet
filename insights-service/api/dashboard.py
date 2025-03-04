from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any
from config.database import get_db
from services.dashboard import get_dashboard_for_user, compute_and_save_dashboard
from dto.refresh_dashboard_dto import RefreshDashboardDTO

router = APIRouter()


@router.get("/")
async def get_dashboard():
    return "Dashboard endpoint at your service! 🫡"


@router.get("/{user_id}", response_model=Dict[str, Any])
async def get_user_dashboard(
    user_id: str,
    refresh: bool = Query(False, description="Force recalculation of dashboard"),
):
    """
    Get financial dashboard for a specific user.
    If refresh=True, recalculates dashboard from raw data.
    Otherwise tries to fetch stored dashboard first.
    """
    try:
        dashboard = get_dashboard_for_user(user_id, refresh)
        return dashboard
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate dashboard: {str(e)}"
        )


@router.post("/refresh", response_model=Dict[str, Any])
async def refresh_user_dashboard(
    req: RefreshDashboardDTO, db: Session = Depends(get_db)
):
    """
    Force refresh of dashboard data for a user.
    """
    try:
        user_id = req.user_id
        dashboard = compute_and_save_dashboard(user_id, db)
        return dashboard
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to refresh dashboard: {str(e)}"
        )
