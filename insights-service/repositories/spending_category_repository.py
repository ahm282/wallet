from models.psql.spending_category import SpendingCategory
from .base_repository import BaseRepository


class SpendingCategoryRepository(BaseRepository[SpendingCategory]):
    def __init__(self):
        super().__init__(SpendingCategory)
