from models.psql.goal_projection import GoalProjection
from .base_repository import BaseRepository


class GoalProjectionRepository(BaseRepository[GoalProjection]):
    def __init__(self):
        super().__init__(GoalProjection)
