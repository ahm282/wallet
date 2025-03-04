from pydantic import BaseModel


class RefreshDashboardDTO(BaseModel):
    user_id: str
