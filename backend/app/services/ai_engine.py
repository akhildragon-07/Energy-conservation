import os
import io
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load env variables (API Key)
load_dotenv()

def analyze_image(image_bytes: bytes) -> dict:
    """
    Uses Google Gemini 2.5 Flash to analyze the drone image for solar panel defects.
    """
    detected_defects = []
    
    try:
        # Get the API key from environment
        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        
        if not gemini_api_key or gemini_api_key == "":
            print("WARNING: GEMINI_API_KEY is not set. Falling back to simple heuristic.")
            return {"defects": ["dust", "crack"]} # Fallback mock

        client = genai.Client(api_key=gemini_api_key)
        
        prompt = """
        You are an expert AI inspector for solar panels. I will provide an image or thermal scan of a solar panel.
        Analyze the image and respond ONLY with a valid JSON object in this exact format:
        {
          "defects": [
            {
              "type": "defect_type",
              "severity": "High|Medium|Low",
              "confidence": 0.95,
              "observation": "Brief scientific reason for this detection"
            }
          ],
          "time_to_failure_days": 14,
          "overall_health_score": 85
        }
        
        Possible defect types are: "crack", "dust", "hotspot", "broken_cell", "delamination", "snail_trail", "pid", "bypass_diode_failure".
        If there are no defects, return {"defects": [], "time_to_failure_days": -1, "overall_health_score": 100}.
        Predict the number of days until the panel fails completely (an integer, use -1 if >= 365).
        Provide an overall health score from 0 to 100 based on the detected anomalies.
        Do not include markdown blocks like ```json in the output, just the raw JSON.
        """
        
        # Determine MIME type heuristically (FastAPI upload content type is tricky here, but genai library accepts bytes)
        # Using a generic type for the image blob
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),
                prompt,
            ]
        )
        
        # Parse the JSON response
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1).replace("```", "", 1).strip()
            
        result = json.loads(response_text)
        detected_defects = result.get("defects", [])
        time_to_failure_days = result.get("time_to_failure_days", -1)
        overall_health_score = result.get("overall_health_score", 100)
        
    except Exception as e:
        print(f"Error processing image with Gemini: {e}")
        time_to_failure_days = -1
        overall_health_score = 100
        # Fallback to no defects if processing fails
        pass
        
    return {
        "defects": detected_defects,
        "time_to_failure_days": time_to_failure_days,
        "overall_health_score": overall_health_score
    }
