import cv2
import numpy as np
from typing import Tuple, List, Dict

def validate_solar_panel(image_bytes: bytes) -> Tuple[bool, str]:
    """
    Validates if the image contains a solar panel using grid detection.
    Returns (is_valid, message).
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return False, "Invalid image data"

        # 1. Preprocessing for grid detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # 2. Edge detection
        edges = cv2.Canny(blurred, 50, 150, apertureSize=3)
        
        # 3. Hough Line Transform to detect grid-like structures
        # Standard Hough Line Transform
        lines = cv2.HoughLines(edges, 1, np.pi/180, 150)
        
        if lines is None:
            return False, "No grid patterns detected"

        horizontal_lines = 0
        vertical_lines = 0
        
        for line in lines:
            rho, theta = line[0]
            # Convert radians to degrees
            angle = np.rad2deg(theta)
            
            # Vertical lines (~0 or ~180 degrees)
            if angle < 10 or angle > 170:
                vertical_lines += 1
            # Horizontal lines (~90 degrees)
            elif 80 < angle < 100:
                horizontal_lines += 1

        # Validation threshold: Solar panels have many parallel lines
        # Adjust these thresholds for sensitivity
        if horizontal_lines >= 3 and vertical_lines >= 3:
            return True, "Solar panel detected"
        
        return False, f"Insufficient grid patterns (H:{horizontal_lines}, V:{vertical_lines})"

    except Exception as e:
        return False, f"Validation error: {str(e)}"

def preprocess_for_analysis(image_bytes: bytes) -> np.ndarray:
    """
    5-Stage Robust Preprocessing Pipeline:
    1. Resize to 512x512
    2. Grayscale Conversion
    3. Gaussian Noise Reduction
    4. CLAHE Contrast Enhancement
    5. Normalization
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image data")
        
    # 1. Resize
    resized = cv2.resize(img, (512, 512))
    
    # 2. Grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    
    # 3. Gaussian Blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # 4. CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(blurred)
    
    # 5. Normalization
    normalized = cv2.normalize(enhanced, None, 0, 255, cv2.NORM_MINMAX)
    
    return normalized

def detect_defects_cv(img: np.ndarray) -> Dict:
    """
    Performs crack and dust detection using advanced OpenCV.
    Returns defect metadata including bounding boxes.
    """
    # 1. Crack Detection (Canny + Contours)
    edges = cv2.Canny(img, 30, 100)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    dilated = cv2.dilate(edges, kernel, iterations=1)
    closed = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    crack_count = 0
    total_crack_length = 0
    crack_boxes = []
    for cnt in contours:
        length = cv2.arcLength(cnt, True)
        # Filter by length to ignore noise
        if length > 20: 
            crack_count += 1
            total_crack_length += length
            # Get bounding box
            x, y, w, h = cv2.boundingRect(cnt)
            crack_boxes.append((x, y, w, h))

    # 2. Dust Detection (Local Variance / Texture)
    # Use Sobel for texture/soiling detection
    sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
    magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
    magnitude = np.uint8(np.absolute(magnitude))
    
    # Threshold for noise (dust particles create high-frequency texture)
    _, dust_mask = cv2.threshold(magnitude, 40, 255, cv2.THRESH_BINARY)
    dust_percentage = (np.sum(dust_mask == 255) / (img.shape[0] * img.shape[1])) * 100
    
    # Find dust clusters for bounding boxes
    dust_contours, _ = cv2.findContours(dust_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    dust_boxes = []
    for cnt in dust_contours:
        if cv2.contourArea(cnt) > 50: # Only significant clusters
            x, y, w, h = cv2.boundingRect(cnt)
            dust_boxes.append((x, y, w, h))

    return {
        "crack_count": crack_count,
        "crack_length_estimate": round(total_crack_length, 2),
        "dust_percentage": round(dust_percentage, 2),
        "crack_boxes": crack_boxes,
        "dust_boxes": dust_boxes,
        "crack_mask": closed,
        "dust_mask": dust_mask,
        "original_processed": img
    }

def annotate_image(image_bytes: bytes, cv_results: Dict, panel_id: str) -> str:
    """
    Draws bounding boxes and labels on the image for defects.
    Returns base64 encoded image.
    """
    import base64
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (512, 512))
    
    # Draw Cracks
    for (x, y, w, h) in cv_results.get("crack_boxes", []):
        # Red box for cracks
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), 2)
        cv2.putText(img, f"Panel {panel_id} - Crack", (x, y-10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        
    # Draw Dust
    for (x, y, w, h) in cv_results.get("dust_boxes", []):
        # Yellow box for dust
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 255), 2)
        cv2.putText(img, f"Panel {panel_id} - Dust", (x, y-10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
        
    _, buffer = cv2.imencode('.jpg', img)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_str}"

def generate_heatmap(image_bytes: bytes, crack_mask: np.ndarray, dust_mask: np.ndarray) -> str:
    """
    Generates a color-mapped heatmap overlay on the original image.
    Returns the image as a base64 encoded string.
    """
    import base64
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (512, 512))
    
    # Create overlays
    overlay = img.copy()
    
    # Cracks in Red
    overlay[crack_mask > 0] = [0, 0, 255]
    
    # Dust in Yellow (using dust mask)
    overlay[dust_mask > 0] = [0, 255, 255]
    
    # Blend with original
    alpha = 0.4
    heatmap = cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0)
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', heatmap)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    
    return f"data:image/jpeg;base64,{base64_str}"
