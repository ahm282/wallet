import logging
from pymongo import MongoClient
from config.settings import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from repositories.user_repository import UserRepository
from repositories.analysis_job_repository import AnalysisJobRepository
from repositories.bill_forecast_repository import BillForecastRepository
from repositories.budget_analysis_repository import BudgetAnalysisRepository
from repositories.cash_flow_repository import CashFlowRepository
from repositories.dashboard_stat_repository import DashboardStatRepository
from repositories.goal_projection_repository import GoalProjectionRepository
from repositories.income_prediction_repository import IncomePredictionRepository
from repositories.insight_repository import InsightRepository
from repositories.spending_prediction_repository import SpendingPredictionRepository

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#######################
# PostgreSQL
#######################
SQLALCHEMY_DATABASE_URL = settings.POSTGRES_URI

# PostgreSQL engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Repository instances
user_repository = UserRepository()
dashboard_stats_repository = DashboardStatRepository()
budget_analysis_repository = BudgetAnalysisRepository()
bill_forecast_repository = BillForecastRepository()
cash_flow_repository = CashFlowRepository()
analysis_job_repository = AnalysisJobRepository()
goal_projection_repository = GoalProjectionRepository()
income_prediction_repository = IncomePredictionRepository()
insight_repository = InsightRepository()
spending_prediction_repository = SpendingPredictionRepository()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#######################
# MongoDB
#######################
mongo_client = MongoClient(settings.MONGO_URI)
mongo_db = mongo_client.get_database(settings.MONGO_DB_NAME)


def get_mongo_db():
    return mongo_db


# Collections mapping - matches NestJS schemas
COLLECTIONS = {
    "transactions": "transactions",
    "goals": "goals",
    "budgets": "budgets",
    "bills": "bills",
    "accounts": "accounts",
}
