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

from pydantic import BaseModel
import os
from google import genai
from google.genai import types
import sqlalchemy
from fastapi.responses import StreamingResponse
import csv
import io

class ChatMessage(BaseModel):
    message: str
    history: List[dict] = [] # List of {"role": "user/assistant", "text": "..."}

router = APIRouter()

@router.post("/upload-image")
async def upload_and_analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image type")
    
    contents = await file.read()
    
    # 1. Validation Step
    from ..services.image_processing import validate_solar_panel, preprocess_for_analysis, detect_defects_cv
    is_valid, validation_msg = validate_solar_panel(contents)
    
    if not is_valid:
        return {
            "status": "invalid_image",
            "message": f"Uploaded image does not appear to be a solar panel. {validation_msg}",
            "analysis_performed": false
        }
    
    # 2. Process image with Advanced CV
    preprocessed = preprocess_for_analysis(contents)
    cv_results = detect_defects_cv(preprocessed)
    
    # 3. Simulate Row and Column for Demo
    import random
    row_num = random.randint(1, 10)
    col_num = random.randint(1, 20)
    panel_id = f"R{row_num}-C{col_num}"
    
    # 4. Generate Visuals
    from ..services.image_processing import generate_heatmap, annotate_image
    heatmap_b64 = generate_heatmap(contents, cv_results["crack_mask"], cv_results["dust_mask"])
    annotated_b64 = annotate_image(contents, cv_results, panel_id)
    
    # 5. Calculate health score with new penalty-based model
    health_data = calculate_health_score(cv_results)
    
    # Save to SQLite DB
    db_report = PanelReport(
        panel_id=panel_id,
        row=row_num,
        column=col_num,
        defects=health_data["defect_types"],
        health_score=health_data["score"],
        maintenance_required=health_data["maintenance_required"],
        status_category=health_data["category"],
        estimated_energy_loss=health_data["estimated_energy_loss"],
        financial_loss_usd=health_data["financial_loss_usd"],
        time_to_failure_days=health_data["time_to_failure_days"],
        recommendation=health_data["recommendation"]
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return {
        "panel_id": db_report.panel_id,
        "row": db_report.row,
        "column": db_report.column,
        "defects": health_data["defect_types"].split(",") if health_data["defect_types"] else [],
        "health_score": db_report.health_score,
        "maintenance_required": db_report.maintenance_required,
        "status_category": db_report.status_category,
        "estimated_energy_loss": db_report.estimated_energy_loss,
        "financial_loss_usd": db_report.financial_loss_usd,
        "time_to_failure_days": db_report.time_to_failure_days,
        "recommendation": db_report.recommendation,
        "crack_length_estimate": health_data.get("crack_length_estimate", 0),
        "dust_percentage": health_data.get("dust_percentage", 0),
        "heatmap_base64": heatmap_b64,
        "annotated_image": annotated_b64,
        "status": "success",
        "analysis_performed": True
    }

@router.post("/batch-analysis", response_model=BatchAnalysisResponse)
async def batch_upload_and_analyze(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    reports = []
    
    from ..services.image_processing import validate_solar_panel, preprocess_for_analysis, detect_defects_cv, generate_heatmap, annotate_image
    import random
    
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
            
        contents = await file.read()
        
        # Validation
        is_valid, validation_msg = validate_solar_panel(contents)
        if not is_valid:
            reports.append({
                "panel_id": f"INVALID-{uuid.uuid4().hex[:4].upper()}",
                "row": 0,
                "column": 0,
                "defects": [],
                "health_score": 0,
                "maintenance_required": False,
                "status_category": "Invalid",
                "estimated_energy_loss": "0%",
                "financial_loss_usd": 0.0,
                "time_to_failure_days": -1,
                "recommendation": f"Validation failed: {validation_msg}",
                "status": "invalid_image",
                "analysis_performed": False
            })
            continue

        # Simulate Position
        row_num = random.randint(1, 10)
        col_num = random.randint(1, 20)
        panel_id = f"R{row_num}-C{col_num}"

        preprocessed = preprocess_for_analysis(contents)
        cv_results = detect_defects_cv(preprocessed)
        heatmap_b64 = generate_heatmap(contents, cv_results["crack_mask"], cv_results["dust_mask"])
        annotated_b64 = annotate_image(contents, cv_results, panel_id)
        health_data = calculate_health_score(cv_results)
        
        db_report = PanelReport(
            panel_id=panel_id,
            row=row_num,
            column=col_num,
            defects=health_data["defect_types"],
            health_score=health_data["score"],
            maintenance_required=health_data["maintenance_required"],
            status_category=health_data["category"],
            estimated_energy_loss=health_data["estimated_energy_loss"],
            financial_loss_usd=health_data["financial_loss_usd"],
            time_to_failure_days=health_data["time_to_failure_days"],
            recommendation=health_data["recommendation"]
        )
        db.add(db_report)
        
        reports.append({
            "panel_id": db_report.panel_id,
            "row": db_report.row,
            "column": db_report.column,
            "defects": health_data["defect_types"].split(",") if health_data["defect_types"] else [],
            "health_score": db_report.health_score,
            "maintenance_required": db_report.maintenance_required,
            "status_category": db_report.status_category,
            "estimated_energy_loss": db_report.estimated_energy_loss,
            "financial_loss_usd": db_report.financial_loss_usd,
            "time_to_failure_days": db_report.time_to_failure_days,
            "recommendation": db_report.recommendation,
            "crack_length_estimate": health_data.get("crack_length_estimate", 0),
            "dust_percentage": health_data.get("dust_percentage", 0),
            "heatmap_base64": heatmap_b64,
            "annotated_image": annotated_b64,
            "status": "success",
            "analysis_performed": True
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
            "estimated_energy_loss": "0%",
            "total_financial_loss": 0.0
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
            
    # Calculate total financial loss
    all_reports = db.query(PanelReport).all()
    total_financial_loss = sum([r.financial_loss_usd for r in all_reports if r.financial_loss_usd is not None])

    return {
        "total_panels": total_panels,
        "critical_panels": critical_panels,
        "avg_health": avg_health,
        "estimated_energy_loss": f"{min(100, int(overall_loss))}%",
        "total_financial_loss": total_financial_loss
    }

@router.post("/chat")
def chat_with_ai(chat: ChatMessage, db: Session = Depends(get_db)):
    print(f"DEBUG: Chat endpoint reached with message: {chat.message}")
    """
    Chat with the AI Assistant about the solar farm with persistent history.
    """
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        return {"response": "Please set your GEMINI_API_KEY in the backend/.env file!"}

    try:
        # Gather rich context from the database
        total_panels = db.query(PanelReport).count()
        critical_panels = db.query(PanelReport).filter(PanelReport.status_category == "Critical").count()
        # Query average health safely
        avg_health_raw = db.query(sqlalchemy.func.avg(PanelReport.health_score)).scalar()
        avg_health = int(avg_health_raw) if avg_health_raw is not None else 100
        
        system_context = (
            f"SYSTEM STATE: The solar farm has {total_panels} panels. "
            f"{critical_panels} panels are in CRITICAL condition. "
            f"The current aggregate fleet health is {avg_health}%."
        )
        
        client = genai.Client(api_key=gemini_api_key)
        
        # Build chat history for Gemini
        chat_contents = [
            types.Content(role="user", parts=[types.Part(text=
                "You are a professional Solar Farm Intelligence agent. Answer based on the following context and history."
                f"\nContext: {system_context}"
            )]),
            types.Content(role="model", parts=[types.Part(text="Understood. I am ready to assist with the solar farm operations.")])
        ]
        
        # Map user/assistant history to gemini roles
        for msg in chat.history:
            role = "user" if msg["role"] == "user" else "model"
            chat_contents.append(types.Content(role=role, parts=[types.Part(text=msg["text"])]))
            
        # Add the current message
        chat_contents.append(types.Content(role="user", parts=[types.Part(text=chat.message)]))
        
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=chat_contents,
        )
        
        return {"response": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return {"response": "The AI Assistant is currently reaching its request limit (Quota Exhausted). Please try again in a minute or check your Gemini API key quota."}
        return {"response": "I'm sorry, I encountered an error. Please check the backend logs."}

@router.get("/export-report")
def export_report(db: Session = Depends(get_db)):
    """
    Exports all panel reports as a CSV file.
    """
    all_reports = db.query(PanelReport).all()
    
    # Create an in-memory string buffer for the CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Panel ID", "Row", "Column", "Health Score", "Defects", 
        "Maintenance Required", "Status", "Energy Loss", 
        "Financial Loss ($)", "Recommendation", "Date"
    ])
    
    # Write data rows
    for report in all_reports:
        writer.writerow([
            report.panel_id,
            report.row,
            report.column,
            report.health_score,
            report.defects,
            "Yes" if report.maintenance_required else "No",
            report.status_category,
            report.estimated_energy_loss,
            report.financial_loss_usd,
            report.recommendation,
            report.inspection_date.strftime("%Y-%m-%d %H:%M") if report.inspection_date else "N/A"
        ])
    
    # Seek to start
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=solar_intelligence_report.csv"}
    )
