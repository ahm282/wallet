from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    JSON,
    DateTime,
    Enum,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from config.base import Base
from .enums import InsightType


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))

    # Insight data
    type = Column(Enum(InsightType))
    message = Column(String)
    relevance_score = Column(Float)
    data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="insights")
