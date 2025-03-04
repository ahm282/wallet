from models.psql.spending_prediction import SpendingPrediction
from .base_repository import BaseRepository


class SpendingPredictionRepository(BaseRepository[SpendingPrediction]):
    def __init__(self):
        super().__init__(SpendingPrediction)
