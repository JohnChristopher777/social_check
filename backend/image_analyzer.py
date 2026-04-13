import cv2
import numpy as np
import pytesseract
from fastapi import UploadFile

# Advanced AI Extensions
try:
    from pyzbar.pyzbar import decode as decode_barcode
    HAS_PYZBAR = True
except ImportError:
    HAS_PYZBAR = False

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    HAS_MEDIAPIPE = False

class ImageAnalyzer:
    def __init__(self):
        print("Initializing Computer Vision Engine (OpenCV + Advanced)...")
        # Legacy fallback
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        print("Computer Vision Engine Ready.")

    async def analyze(self, image_file: UploadFile):
        score_deductions = 0
        reasons = []

        if not image_file:
            return {"score_deductions": 0, "reasons": []}

        try:
            # 1. Read image file buffer into an OpenCV digestible format
            contents = await image_file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {"score_deductions": 0, "reasons": ["Invalid image format"]}

            # Grayscale drastically speeds up HaarCascades and improves OCR
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # 2. Strict Real Face Detection (Filters Anime/Cartoons)
            if HAS_MEDIAPIPE:
                mp_face_detection = mp.solutions.face_detection
                with mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.6) as face_detection:
                    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    results = face_detection.process(img_rgb)
                    if results.detections:
                        score_deductions += 15
                        reasons.append("Real human face exposed (Anime/Cartoons filtered)")
            else:
                faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7, minSize=(40, 40))
                if len(faces) > 0:
                    score_deductions += 15
                    reasons.append("Public face exposure")

            # 2.5 QR & Barcode Detection (Tickets, ID Cards, Bills)
            if HAS_PYZBAR:
                barcodes = decode_barcode(img)
                if barcodes:
                    score_deductions += 30
                    reasons.append("Machine-readable Data (QR/Barcode) exposed")

            # 3. Optical Character Recognition (Fallback wrapped gracefully)
            try:
                extracted_text = pytesseract.image_to_string(gray).lower()
                sensitive_vision_keywords = ["id ", "badge", "ssn", "password", "boarding pass", "passenger", "confidential"]
                
                detected_keywords = [kw for kw in sensitive_vision_keywords if kw in extracted_text]
                if detected_keywords:
                    score_deductions += 25
                    reasons.append(f"Visual Text Exposure")
            except pytesseract.TesseractNotFoundError:
                print("WARNING: Tesseract binary not installed on OS. Visual OCR skipped safely.")

            # Reset file pointer so FastAPI handles cleanup nicely
            await image_file.seek(0)
            
            return {
                "score_deductions": score_deductions,
                "reasons": reasons
            }

        except Exception as e:
            print(f"Image analysis structural error: {str(e)}")
            return {"score_deductions": 0, "reasons": []}