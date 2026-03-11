from pydantic import BaseModel
from typing import List

class PanelAnalysisResponse(BaseModel):
    panel_id: str
    defects: List[str]
    health_score: int
    maintenance_required: bool
    status_category: str
    estimated_energy_loss: str
    recommendation: str

class PanelReportResponse(BaseModel):
    panel_id: str
    defects: List[str]
    health_score: int
    maintenance_required: bool
    status_category: str
    estimated_energy_loss: str
    recommendation: str

class HealthScoreResponse(BaseModel):
    panel_id: str
    health_score: int
    status: str

class SystemAnalyticsResponse(BaseModel):
    total_panels: int
    critical_panels: int
    avg_health: int
    estimated_energy_loss: str

class BatchAnalysisResponse(BaseModel):
    total_processed: int
    reports: List[PanelAnalysisResponse]
