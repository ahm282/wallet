from models.psql.dashboard_stat import DashboardStat
from .base_repository import BaseRepository


class DashboardStatRepository(BaseRepository[DashboardStat]):
    def __init__(self):
        super().__init__(DashboardStat)

    def get_latest_by_user_id(self, db, user_id):
        return (
            db.query(DashboardStat)
            .filter(DashboardStat.user_id == user_id)
            .order_by(DashboardStat.created_at.desc())
            .first()
        )
