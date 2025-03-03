import logging
from datetime import datetime
from sqlalchemy.orm import Session
from config.database import SessionLocal
from services.dashboard import compute_and_save_dashboard
from models.psql.user import User

logger = logging.getLogger(__name__)


def update_all_dashboards():
    """Update dashboards for all users."""
    db = SessionLocal()
    try:
        # Get all user IDs
        users = db.query(User).all()

        for user in users:
            try:
                logger.info(f"Updating dashboard for user {user.id}")
                compute_and_save_dashboard(user.id, db)
                logger.info(f"Successfully updated dashboard for user {user.id}")
            except Exception as e:
                logger.error(f"Failed to update dashboard for user {user.id}: {str(e)}")
    finally:
        db.close()
