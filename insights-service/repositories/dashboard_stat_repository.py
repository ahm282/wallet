from models.psql.dashboard_stat import DashboardStat
from .base_repository import BaseRepository


class DashboardStatRepository(BaseRepository[DashboardStat]):
    def __init__(self):
        super().__init__(DashboardStat)
