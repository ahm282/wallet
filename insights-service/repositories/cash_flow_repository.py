from models.psql.cash_flow import CashFlow
from .base_repository import BaseRepository


class CashFlowRepository(BaseRepository[CashFlow]):
    def __init__(self):
        super().__init__(CashFlow)
