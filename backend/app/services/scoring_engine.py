def calculate_health_score(defects: list) -> dict:
    """
    Calculates the health score based on detected defects and computes estimated energy loss.
    """
    score = 100
    
    penalties = {
        "crack": 25,
        "dust": 10,
        "hotspot": 30,
        "broken_cell": 40,
        "delamination": 20
    }
    
    for defect in defects:
        score -= penalties.get(defect, 0)
        
    score = max(0, score) # Ensure score doesn't go below 0
    
    category = "Healthy"
    if score < 50:
        category = "Critical"
    elif score <= 80:
        category = "Moderate"
        
    maintenance_required = score < 60
    
    # Calculate Estimated Energy Loss
    # Logic: 100 health = 0% loss. For every 10 points below 100, we add ~3-5% loss.
    # If health < 70, energy loss gets steeper.
    if score >= 90:
        energy_loss = 0
    else:
        # Base loss: (100 - score) * 0.3
        energy_loss = (100 - score) * 0.4
        if score < 70:
            energy_loss += 5.0 # extra penalty
            
    energy_loss_str = f"{min(100, int(energy_loss))}%"
    
    # AI Maintenance Recommendations (WOW Feature)
    recommendations = []
    if "crack" in defects:
        recommendations.append("Schedule panel glass replacement within 30 days. High risk of moisture ingress.")
    if "dust" in defects:
        recommendations.append("Dispatch cleaning drone or maintenance crew to wash panel surface to restore energy yield.")
    if "hotspot" in defects:
        recommendations.append("Immediate electrical inspection required. Potential fire hazard or bypass diode failure.")
    if "broken_cell" in defects:
        recommendations.append("Panel requires complete replacement due to irreversible cell damage.")
    if "delamination" in defects:
        recommendations.append("Monitor closely; consider replacement if energy output drops below 80% nominal.")
        
    if not defects:
        recommendations.append("No immediate action required. Panel operating optimally.")
        
    recommendation_str = " | ".join(recommendations)
    
    return {
        "score": score,
        "category": category,
        "maintenance_required": maintenance_required,
        "estimated_energy_loss": energy_loss_str,
        "recommendation": recommendation_str
    }
