from models.psql.analysis_job import AnalysisJob
from .base_repository import BaseRepository


class AnalysisJobRepository(BaseRepository[AnalysisJob]):
    def __init__(self):
        super().__init__(AnalysisJob)
