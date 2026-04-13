import json
import urllib.request
import urllib.parse
from urllib.error import URLError, HTTPError
import ssl

def safe_scrape(url: str) -> str:
    """
    Safely extracts context from Social URLs using Microlink's Free OSINT Graph API.
    Bypasses aggressive Twitter/Instagram Playwright blocks natively.
    """
    if not url or "http" not in url:
        return ""

    try:
        print(f"OSINT Scraper Agent engaging URL: {url}")
        
        # Build API request to Microlink
        api_url = f"https://api.microlink.io/?url={urllib.parse.quote(url)}"
        
        # Bypass SSL verification issues on local setups
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(
            api_url, 
            headers={'User-Agent': 'Mozilla/5.0 Risk Analysis Engine'}
        )
        
        with urllib.request.urlopen(req, context=context, timeout=8) as response:
            data = json.loads(response.read().decode())
            
            if data.get("status") == "success":
                metadata = data.get("data", {})
                
                # Extract heavily prioritized context chunks
                title = metadata.get("title", "")
                description = metadata.get("description", "")
                author = metadata.get("author", "")
                publisher = metadata.get("publisher", "")
                
                # Synthesize text for NLP engine digestion
                synthesized = []
                if author: synthesized.append(f"Author Profile: {author}")
                if publisher: synthesized.append(f"Platform: {publisher}")
                if title: synthesized.append(f"Header Context: {title}")
                if description: synthesized.append(f"Caption Context: {description}")
                
                final_text = " || ".join(synthesized)
                print(f"Scraper returned: {final_text[:60]}...")
                return final_text
            else:
                print("Microlink returned non-success payload.")
                return ""
                
    except HTTPError as e:
        print(f"Scraper HTTP Error: {e.code}")
        return ""
    except URLError as e:
        print(f"Scraper URL Error: {e.reason}")
        return ""
    except Exception as e:
        print(f"Scraper critical subsystem error: {str(e)}")
        return ""

def smart_scrape(url: str) -> dict:
    """
    Specifically designed for the Auto-Fill UI system. 
    Returns separate text and image URLs instead of a concatenated string.
    """
    
    def detect_platform(u: str) -> str:
        domain = u.lower()
        if "instagram" in domain: return "Instagram"
        if "twitter" in domain or "x.com" in domain: return "Twitter"
        if "linkedin" in domain: return "LinkedIn"
        if "facebook" in domain or "fb.com" in domain: return "Facebook"
        return "Instagram"

    if not url or "http" not in url:
        return {"text": "", "image": "", "platform": "Instagram"}

    platform_name = detect_platform(url)

    try:
        api_url = f"https://api.microlink.io/?url={urllib.parse.quote(url)}"
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0 Auto-Fill Engine'})
        with urllib.request.urlopen(req, context=context, timeout=8) as response:
            data = json.loads(response.read().decode())
            
            if data.get("status") == "success":
                metadata = data.get("data", {})
                
                # Try multiple fields for a caption/text
                text = metadata.get("description", "") or metadata.get("title", "")
                
                # Robust image extraction
                image_val = metadata.get("image")
                image_url = ""
                if isinstance(image_val, dict):
                    image_url = image_val.get("url", "")
                elif isinstance(image_val, str):
                    image_url = image_val
                
                # Fallback to logo if needed
                if not image_url:
                    logo_val = metadata.get("logo")
                    if isinstance(logo_val, dict):
                        image_url = logo_val.get("url", "")
                    elif isinstance(logo_val, str):
                        image_url = logo_val
                
                return {
                    "text": text,
                    "image": image_url,
                    "platform": platform_name
                }
            return {"text": "", "image": "", "platform": platform_name}
    except Exception as e:
        print(f"Auto-fill Scraper error: {e}")
        return {"text": "", "image": "", "platform": platform_name}
