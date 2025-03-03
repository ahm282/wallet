from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    ForeignKey,
)
from datetime import datetime
from sqlalchemy.orm import relationship
from config.base import Base


class CashFlow(Base):
    __tablename__ = "cash_flow"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    date = Column(DateTime)
    income = Column(Float, default=0)
    expenses = Column(Float, default=0)
    net = Column(Float, default=0)
    period_type = Column(String)  # "day", "week", "month", "year"
    period_id = Column(String)  # Format like "2023-10" for month
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="cash_flows")
