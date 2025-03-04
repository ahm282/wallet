from models.psql.insight import Insight
from .base_repository import BaseRepository


class InsightRepository(BaseRepository[Insight]):
    def __init__(self):
        super().__init__(Insight)
