from models.psql.income_prediction import IncomePrediction
from .base_repository import BaseRepository


class IncomePredictionRepository(BaseRepository[IncomePrediction]):
    def __init__(self):
        super().__init__(IncomePrediction)

    def get_all_by_user_id(self, user_id: str) -> list[IncomePrediction]:
        return self.model.query.filter_by(user_id=user_id).all()
