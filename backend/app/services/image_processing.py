import cv2
import numpy as np

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Decodes the raw image bytes and applies basic preprocessing:
    1. Resize image
    2. Convert to grayscale
    3. Noise reduction (Gaussian Blur)
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    
    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image data")
        
    # 1. Resize image (normalize resolution for consistency)
    resized_img = cv2.resize(img, (512, 512))
    
    # 2. Convert to grayscale
    gray_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)
    
    # 3. Noise reduction
    blurred_img = cv2.GaussianBlur(gray_img, (5, 5), 0)
    
    return blurred_img

def detect_edges(preprocessed_img: np.ndarray) -> np.ndarray:
    """
    Applies Canny edge detection. Useful for finding cracks.
    """
    edges = cv2.Canny(preprocessed_img, threshold1=100, threshold2=200)
    return edges
