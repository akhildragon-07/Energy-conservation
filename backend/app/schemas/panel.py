from pydantic import BaseModel
from typing import List

class PanelAnalysisResponse(BaseModel):
    panel_id: str
    row: int = 0
    column: int = 0
    defects: List[str]
    health_score: int
    maintenance_required: bool
    status_category: str
    estimated_energy_loss: str
    financial_loss_usd: float
    time_to_failure_days: int
    recommendation: str
    crack_length_estimate: float = 0
    dust_percentage: float = 0
    heatmap_base64: str = None
    annotated_image: str = None
    status: str = "success"
    message: str = None
    analysis_performed: bool = True

class PanelReportResponse(BaseModel):
    panel_id: str
    row: int = 0
    column: int = 0
    defects: List[str]
    health_score: int
    maintenance_required: bool
    status_category: str
    estimated_energy_loss: str
    financial_loss_usd: float
    time_to_failure_days: int
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
    total_financial_loss: float

class BatchAnalysisResponse(BaseModel):
    total_processed: int
    reports: List[PanelAnalysisResponse]
