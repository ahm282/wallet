from models.psql.bill_forecast import BillForecast
from .base_repository import BaseRepository


class BillForecastRepository(BaseRepository[BillForecast]):
    def __init__(self):
        super().__init__(BillForecast)
