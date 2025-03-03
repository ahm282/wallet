import enum


class InsightType(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    TIP = "tip"
    OPPORTUNITY = "opportunity"


class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

