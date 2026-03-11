from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from ..schemas.panel import (
    PanelAnalysisResponse, HealthScoreResponse, PanelReportResponse,
    SystemAnalyticsResponse, BatchAnalysisResponse
)
from ..services.ai_engine import analyze_image
from ..services.scoring_engine import calculate_health_score
from ..database import get_db
from ..models.panel import PanelReport
import uuid

router = APIRouter()

@router.post("/upload-image", response_model=PanelAnalysisResponse)
async def upload_and_analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image type")
    
    contents = await file.read()
    panel_id = f"PNL-{uuid.uuid4().hex[:6].upper()}"
    
    # Process image with AI logic
    ai_results = analyze_image(contents)
    
    # Calculate health score
    health_data = calculate_health_score(ai_results["defects"])
    defects_str = ",".join(ai_results["defects"])
    
    # Save to SQLite DB
    db_report = PanelReport(
        panel_id=panel_id,
        defects=defects_str,
        health_score=health_data["score"],
        maintenance_required=health_data["maintenance_required"],
        status_category=health_data["category"],
        estimated_energy_loss=health_data["estimated_energy_loss"],
        recommendation=health_data["recommendation"]
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return {
        "panel_id": db_report.panel_id,
        "defects": ai_results["defects"],
        "health_score": db_report.health_score,
        "maintenance_required": db_report.maintenance_required,
        "status_category": db_report.status_category,
        "estimated_energy_loss": db_report.estimated_energy_loss,
        "recommendation": db_report.recommendation
    }

@router.post("/batch-analysis", response_model=BatchAnalysisResponse)
async def batch_upload_and_analyze(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    reports = []
    
    for file in files:
        if not file.content_type.startswith("image/"):
            continue # Skip non-image files in batch
            
        contents = await file.read()
        panel_id = f"PNL-{uuid.uuid4().hex[:6].upper()}"
        ai_results = analyze_image(contents)
        health_data = calculate_health_score(ai_results["defects"])
        
        db_report = PanelReport(
            panel_id=panel_id,
            defects=",".join(ai_results["defects"]),
            health_score=health_data["score"],
            maintenance_required=health_data["maintenance_required"],
            status_category=health_data["category"],
            estimated_energy_loss=health_data["estimated_energy_loss"],
            recommendation=health_data["recommendation"]
        )
        db.add(db_report)
        
        reports.append({
            "panel_id": db_report.panel_id,
            "defects": ai_results["defects"],
            "health_score": db_report.health_score,
            "maintenance_required": db_report.maintenance_required,
            "status_category": db_report.status_category,
            "estimated_energy_loss": db_report.estimated_energy_loss,
            "recommendation": db_report.recommendation
        })
        
    db.commit()
    return {"total_processed": len(reports), "reports": reports}

@router.get("/panel-report/{panel_id}", response_model=PanelReportResponse)
def get_panel_report(panel_id: str, db: Session = Depends(get_db)):
    db_report = db.query(PanelReport).filter(PanelReport.panel_id == panel_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Panel not found")
        
    return {
        "panel_id": db_report.panel_id,
        "defects": db_report.defects.split(",") if db_report.defects else [],
        "health_score": db_report.health_score,
        "maintenance_required": db_report.maintenance_required,
        "status_category": db_report.status_category,
        "estimated_energy_loss": db_report.estimated_energy_loss,
        "recommendation": db_report.recommendation
    }

@router.get("/health-score/{panel_id}", response_model=HealthScoreResponse)
def get_health_score(panel_id: str, db: Session = Depends(get_db)):
    db_report = db.query(PanelReport).filter(PanelReport.panel_id == panel_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Panel not found")
    
    return {
        "panel_id": db_report.panel_id,
        "health_score": db_report.health_score,
        "status": db_report.status_category
    }

@router.get("/system-analytics", response_model=SystemAnalyticsResponse)
def get_system_analytics(db: Session = Depends(get_db)):
    total_panels = db.query(PanelReport).count()
    if total_panels == 0:
        return {
            "total_panels": 0,
            "critical_panels": 0,
            "avg_health": 0,
            "estimated_energy_loss": "0%"
        }
        
    critical_panels = db.query(PanelReport).filter(PanelReport.status_category == "Critical").count()
    
    # Calculate average health
    all_health_scores = [report.health_score for report in db.query(PanelReport.health_score).all()]
    avg_health = sum(all_health_scores) // len(all_health_scores)
    
    # Estimate overall energy loss based on average health
    if avg_health >= 90:
        overall_loss = 0
    else:
        overall_loss = (100 - avg_health) * 0.4
        if avg_health < 70:
            overall_loss += 5.0
            
    return {
        "total_panels": total_panels,
        "critical_panels": critical_panels,
        "avg_health": avg_health,
        "estimated_energy_loss": f"{min(100, int(overall_loss))}%"
    }
