from models.psql.budget_analysis import BudgetAnalysis
from .base_repository import BaseRepository


class BudgetAnalysisRepository(BaseRepository[BudgetAnalysis]):
    def __init__(self):
        super().__init__(BudgetAnalysis)
