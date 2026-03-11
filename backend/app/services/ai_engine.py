import cv2
import numpy as np
from .image_processing import preprocess_image, detect_edges

def analyze_image(image_bytes: bytes) -> dict:
    """
    Uses simple Computer Vision techniques to detect defects for the MVPs.
    - Crack Detection: High edge density
    - Dust Detection: Low variance/brightness changes indicating a covered panel
    """
    detected_defects = []
    
    try:
        # Preprocess the image
        processed_img = preprocess_image(image_bytes)
        
        # --- 1. Crack Detection (using edge density) ---
        edges = detect_edges(processed_img)
        # Calculate percentage of edge pixels
        edge_density = np.sum(edges > 0) / edges.size
        
        # If more than 2% of the image is edges, flag as crack
        if edge_density > 0.02:
            detected_defects.append("crack")
            
        # --- 2. Dust Accumulation (using brightness/variance) ---
        # Dust usually lowers the contrast/variance of the panel surface
        variance = np.var(processed_img)
        mean_brightness = np.mean(processed_img)
        
        # If variance is very low (smooth blur/dust) and brightness is higher (dust reflection)
        if variance < 500 and mean_brightness > 120:
            detected_defects.append("dust")
            
        # Mock other defects that require thermal or complex models
        # (e.g. hotspots, broken cells) 
        # In a real app, thermal images would be checked separately.
            
    except Exception as e:
        print(f"Error processing image: {e}")
        # Fallback to no defects if processing fails
        pass
        
    return {
        "defects": detected_defects
    }
