from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from ..database import Base

class PanelReport(Base):
    __tablename__ = "panel_reports"

    id = Column(Integer, primary_key=True, index=True)
    panel_id = Column(String, unique=True, index=True)
    defects = Column(String) # Store as comma-separated string for simplicity
    health_score = Column(Integer)
    maintenance_required = Column(Boolean, default=False)
    status_category = Column(String)
    estimated_energy_loss = Column(String)
    recommendation = Column(String)
    inspection_date = Column(DateTime(timezone=True), server_default=func.now())
