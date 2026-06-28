from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import our new NLP, CV, and Scraping modules
from text_analyzer import TextAnalyzer
from image_analyzer import ImageAnalyzer
from scraper import safe_scrape, smart_scrape

app = FastAPI(title="Risk Exposure Analysis API")

# Initialize the actual AI Engine during startup
text_engine = TextAnalyzer()
image_engine = ImageAnalyzer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    risk_score: int
    risk_level: str
    reason: str
    confidence: float

@app.get("/")
def read_root():
    return {"status": "FastAPI Processing Engine is Online."}

class ScrapeRequest(BaseModel):
    url: str

@app.post("/api/scrape_post")
async def scrape_post_api(req: ScrapeRequest):
    return smart_scrape(req.url)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_content(
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    
    data_text = text or ""
    scraper_failed = False
    
    if url:
        print(f"Scrape request received for URL: {url}")
        scraped_data = safe_scrape(url)
        
        if scraped_data:
            data_text += f"\n[SCRAPED CONTENT]\n{scraped_data}"
        else:
            scraper_failed = True 

    if scraper_failed and not data_text and not image:
        return {
            "risk_score": 100,
            "risk_level": "Safe",
            "reason": "Scraping failed. Please use manual input.",
            "confidence": 0.0
        }
        
    # --- PROCESSING ENGINE PIPELINE ---
    score = 100
    reasons = []
    
    # 1. Text Analysis Execution
    print(f"--- ENGINE DIAGNOSTIC ---")
    print(f"Data Text Input: {data_text}")
    
    text_results = text_engine.analyze(data_text)
    print(f"Text Analyzer Results: {text_results}")
    
    score -= text_results["score_deductions"]
    reasons.extend(text_results["reasons"])
    
    # 2. Image Analysis Execution
    if image:
        image_results = await image_engine.analyze(image)
        score -= image_results["score_deductions"]
        reasons.extend(image_results["reasons"])
        
    # --- EXPLAINABILITY FORMATTER ---
    score = max(0, score) # Prevent negative scores
    risk_level = "High" if score < 40 else "Moderate" if score < 70 else "Safe"
    reason_str = ", ".join(reasons) if reasons else "No risks detected"
    confidence = round(0.7 + (len(reasons) * 0.05), 2)
    
    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reason": reason_str,
        "confidence": confidence
    }