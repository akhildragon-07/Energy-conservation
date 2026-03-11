def calculate_health_score(cv_results: dict, time_to_failure_days: int = -1) -> dict:
    """
    Calculates health score using a realistic penalty-based model:
    Health Score = 100 - Crack Penalty - Dust Penalty
    """
    score = 100
    crack_length = cv_results.get("crack_length_estimate", 0)
    dust_percentage = cv_results.get("dust_percentage", 0)
    
    # 1. Crack Penalty (40-70 points)
    # Scale: 0 length = 0 penalty, >500 length = 70 penalty
    crack_penalty = 0
    if crack_length > 0:
        crack_penalty = min(70, 40 + (crack_length / 50)) 
    
    # 2. Dust Penalty (10-30 points)
    # Scale: 0% = 0 penalty, >30% coverage = 30 penalty
    dust_penalty = 0
    if dust_percentage > 2: # Ignore trace dust
        dust_penalty = min(30, 10 + (dust_percentage * 0.6))

    score = max(0, int(100 - crack_penalty - dust_penalty))
    
    # Status classification
    category = "Healthy"
    if score < 40:
        category = "Critical"
    elif score < 75:
        category = "Moderate"
        
    maintenance_required = score < 70
    
    # Estimated Energy Loss (Scientific approximation)
    # Cracks cause nonlinear loss, dust is linear
    energy_loss = (crack_penalty * 0.5) + (dust_percentage * 0.4)
    energy_loss_str = f"{min(100, round(energy_loss, 1))}%"
    
    # Financial Calculation (ROI impact)
    # Scaled for a 5MW industrial farm
    financial_loss_usd = round(25.0 * (min(100, energy_loss)), 2)
    
    # Recommendations
    recommendations = []
    defect_types = []
    
    if crack_length > 0:
        defect_types.append("crack")
        recommendations.append(f"[CRACK] Detected ~{int(crack_length)}mm of structural fractures. Glass integrity is compromised.")
    
    if dust_percentage > 5:
        defect_types.append("dust")
        recommendations.append(f"[DUST] {dust_percentage}% surface coverage detected. Optical transmittance performance is reduced.")
    
    if not defect_types:
        category = "Healthy"
        score = 100
        recommendations.append("System integrity verified. No anomalies detected.")
        
    recommendation_str = " | ".join(recommendations)
    
    return {
        "score": score,
        "category": category,
        "maintenance_required": maintenance_required,
        "estimated_energy_loss": energy_loss_str,
        "financial_loss_usd": financial_loss_usd,
        "time_to_failure_days": time_to_failure_days,
        "recommendation": recommendation_str,
        "defect_types": ",".join(defect_types),
        "crack_length_estimate": crack_length,
        "dust_percentage": dust_percentage
    }
