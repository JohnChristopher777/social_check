import re
import logging
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider

# Suppress overly verbose presidio logs
logging.getLogger("presidio-analyzer").setLevel(logging.ERROR)

class TextAnalyzer:
    def __init__(self):
        print("Initializing NLP Engine (Presidio with en_core_web_sm)...")
        # Explicitly configure Presidio to use the lightweight spaCy model
        # to prevent out-of-memory crashes on free cloud hosting instances.
        configuration = {
            "nlp_engine_name": "spacy",
            "models": [{"lang_code": "en", "model_name": "en_core_web_sm"}],
        }
        provider = NlpEngineProvider(nlp_configuration=configuration)
        nlp_engine = provider.create_engine()
        
        self.analyzer = AnalyzerEngine(nlp_engine=nlp_engine, supported_languages=["en"])
        print("NLP Engine Ready.")

    def analyze(self, text: str):
        score_deductions = 0
        reasons = []

        if not text:
            return {"score_deductions": 0, "reasons": []}

        # 1. Primary AI NLP (Presidio)
        results = self.analyzer.analyze(
            text=text, 
            entities=["PHONE_NUMBER", "EMAIL_ADDRESS", "LOCATION"], 
            language='en'
        )
        
        detected_types = set([res.entity_type for res in results])

        # 2. Hard Deterministic Fallback (Regex)
        # Catch 7-digit to 10-digit formats (like +1-555-0198)
        phone_regex = r'\+?\d{1,3}[-. ]?\(?\d{3}\)?[-. ]?\d{3,4}([-. ]?\d{4})?\b'
        email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        ip_regex = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        
        if re.search(phone_regex, text):
            detected_types.add("PHONE_NUMBER")
            
        if re.search(email_regex, text):
            detected_types.add("EMAIL_ADDRESS")
            
        if re.search(ip_regex, text):
            detected_types.add("IP_ADDRESS")

        # 3. Rule-Based Scoring Engine (Locked Final Logic)
        if "PHONE_NUMBER" in detected_types:
            score_deductions += 30
            reasons.append("Phone number exposed")

        if "EMAIL_ADDRESS" in detected_types:
            score_deductions += 20
            reasons.append("Email exposed")

        if "LOCATION" in detected_types:
            score_deductions += 25
            reasons.append("Location data detected")
            
        if "IP_ADDRESS" in detected_types:
            score_deductions += 40
            reasons.append("IP Address / Internal Network Leak detected")

        # 4. Heuristic Password / Context Recognition Logic
        password_clues = [r"\bpassword\b", r"\bborn in\b", r"\bmy dog\b", r"\bmy cat\b", r"\bfirst car\b", r"\bmaiden name\b"]
        if any(re.search(clue, text.lower()) for clue in password_clues):
            score_deductions += 30
            reasons.append("Security Question / Password logic exposed")
            
        # 5. Corporate Phishing Recognition Logic
        corporate_clues = [r"\boffice building\b", r"\bcompany badge\b", r"\binternal server\b", r"\boffer letter\b", r"\bworkstation\b"]
        if any(re.search(clue, text.lower()) for clue in corporate_clues):
            score_deductions += 20
            reasons.append("Corporate B2B Spear Phishing material identified")

        return {
            "score_deductions": score_deductions,
            "reasons": reasons
        }