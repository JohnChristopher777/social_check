export interface Detection {
  type: 'phone' | 'email' | 'location' | 'sensitive' | 'face' | 'document' | 'other' | 'url';
  match: string;
  risk: number;
  description: string;
  illEffect: string;
}

export interface AnalysisResult {
  score: number;
  level: 'Safe' | 'Moderate Risk' | 'High Risk';
  detections: Detection[];
  recommendations: string[];
  contentSummary: string;
  actionableImprovements: string[];
  sanitizedText?: string;
  originalText: string;
}

export interface AnalyzeParams {
  text: string;
  url: string;
  hasImage: boolean;
  isPublic: boolean;
  isFrequent: boolean;
  platform: string;
  hasLocationTag: boolean;
  imageFile?: File | null;
}

export const sampleDataList = [
{
  title: "Professional Knowledge Sharing (Secure)",
  text: "Had the opportunity to attend a session on zero-trust architecture and secure endpoint design. The discussion around minimizing attack surfaces and implementing layered security in distributed systems was particularly insightful. Looking forward to applying these learnings in upcoming projects.",
  isPublic: true,
  isFrequent: false,
  platform: "LinkedIn",
  url: "",
  hasLocationTag: false,
  hasImage: false,
  imageUrl: null
},
  {
    title: "Low Risk Behavioral Exposure",
    text: "Finally heading out for a week-long trip. Time to disconnect and enjoy some peace ✈️",
    isPublic: true,
    isFrequent: false,
    platform: "Instagram",
    url: "",
    hasLocationTag: false,
    hasImage: true,
    imageUrl: "data:image/jpeg;base64,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"
  },
  {
    title: "Subtle Absence Signal",
    text: "Finally taking a small break after months of work. Heading out of the city for a few days. Needed this reset badly.",
    isPublic: true,
    isFrequent: false,
    platform: "Instagram",
    url: "",
    hasLocationTag: false,
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
  },
  {
  title: "Travel + Contact Exposure",
  text: "At Chennai airport waiting for my flight to Bangalore for the client meeting. Network is patchy, so if anything urgent comes up, just call me directly. Will be landing by evening.",
  isPublic: true,
  isFrequent: true,
  platform: "Twitter",
  url: "",
  hasLocationTag: true,
  hasImage: true,
  imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
},
{
  title: "Workplace Exposure (Hidden Risk)",
  text: "Late night at office again 😅 finally wrapping up deployment. Ignore the messy desk, but this setup took weeks to finalize.",
  isPublic: true,
  isFrequent: true,
  platform: "Facebook",
  url: "",
  hasLocationTag: true,
  hasImage: true,
  imageUrl: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80"
},
{
  title: "Implicit Risk Vector (Hacker Inference)",
  text: "Flying out to London tomorrow! Can't believe my dog Max is already 6 today! Where does the time go? 🎉",
  isPublic: true,
  isFrequent: true,
  platform: "Facebook",
  url: "",
  hasLocationTag: true,
  hasImage: true,
  imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"
}
];

export const analyzeContent = async (params: AnalyzeParams): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    if (params.text && params.text !== "No data provided") {
      formData.append("text", params.text);
    }
    if (params.url) {
      formData.append("url", params.url);
    }
    if (params.imageFile) {
      formData.append("image", params.imageFile);
    }

    const apiUrl = import.meta.env.VITE_API_URL || "https://social-check.onrender.com";
    const res = await fetch(`${apiUrl}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    const detections: Detection[] = [];
    const recommendations: string[] = [];
    const actionableImprovements: string[] = [];
    let contentSummary = "Standard Text Analysis completed.";
    
    let finalScore = 100;

    // Track raw flags from backend
    const hasPhone = data.reason?.includes('Phone number');
    const hasEmail = data.reason?.includes('Email');
    const hasFace = data.reason?.includes('Real human face') || data.reason?.includes('Public face');
    const hasDocument = data.reason?.includes('Machine-readable Data') || data.reason?.includes('Visual Text');
    
    // Implicit Risk Logic (Hacker Inference)
    const lowercaseText = params.text.toLowerCase();
    
    // Attacker Intelligence Maps
    const hasTravel = lowercaseText.includes("leaving") || lowercaseText.includes("travel") || lowercaseText.includes("trip") || lowercaseText.includes("flying") || lowercaseText.includes("airport");
    const hasShopping = lowercaseText.includes("shop") || lowercaseText.includes("buy") || lowercaseText.includes("deal") || lowercaseText.includes("haul");
    const hasSecurityHints = lowercaseText.includes("dog") || lowercaseText.includes("birthday") || lowercaseText.includes("anniversary") || lowercaseText.includes("hometown") || lowercaseText.includes("first car");
    const hasCorporateHints = lowercaseText.includes("office") || lowercaseText.includes("badge") || lowercaseText.includes("company") || lowercaseText.includes("team") || lowercaseText.includes("offer letter") || lowercaseText.includes("workspace");
    const isAIImage = lowercaseText.includes("ai") || lowercaseText.includes("generated") || lowercaseText.includes("midjourney") || lowercaseText.includes("dalle") || lowercaseText.includes("prompt");

    // Dynamic Summarization
    if (lowercaseText.length > 5) {
        if (hasTravel) contentSummary = "Post identified as related to travel/location-shifting.";
        else if (hasCorporateHints) contentSummary = "Post reflects corporate, professional, or workplace updates.";
        else if (hasShopping) contentSummary = "Post pertains to retail, shopping, or e-commerce interaction.";
        else if (hasSecurityHints) contentSummary = "Post contains personal milestones, pet references, or significant dates.";
        else contentSummary = "General subjective status update or commentary.";
    }

    // Process Backend Directives
    if (data.reason && data.reason !== "No risks detected" && data.reason !== "Scraping failed. Please use manual input.") {
      const reasonsList = data.reason.split(", ");
      reasonsList.forEach((r: string) => {
          let detType: Detection['type'] = 'other';
          let rsk = 15;
          let effect = 'System flagged this element as a risk vector based on rule-sets.';
          let rec = 'Review the detected element and sanitize before posting.';

          if (r.includes('Phone number') || r.includes('Email')) {
              detType = r.includes('Phone') ? 'phone' : 'email'; 
              rsk = 25;
              effect = 'Primary Credential Exposure: Directly links identity to digital blackmail operations and account takeovers.';
              rec = 'Mandatory Action: Remove direct contact information. Utilize secure direct messaging or burner contacts.';
              actionableImprovements.push("Rewrite to say: 'DM me for contact' instead of pasting direct email/phone.");
          } else if (r.includes('Location')) {
              // Location mapping is merged with travel inference.
              return;
          } else if (r.includes('Real human face') || r.includes('Public face')) {
              // If AI image is detected in the caption, override the deepfake warning.
              if (isAIImage) return; 
              detType = 'face'; rsk = 15;
              effect = 'Deepfake Vulnerability: Exposed facial topography is downloaded by AI threat actors to synthesize video-call impersonations to family/banks.';
              rec = 'Visibility Audit: Consider setting clear facial exposure posts to "Friends Only".';
          } else if (r.includes('Machine-readable Data') || r.includes('Visual Text')) {
              detType = 'document'; rsk = 30;
              effect = 'Barcode/OCR Exploitation: Threat actors extract unencrypted Passenger Name Records (PNR), passwords on sticky notes, and proprietary routing numbers from images.';
              rec = 'Redaction Action: Never post tickets, barcodes, or IDs. Obscure the entire card/code and blur backgrounds digitally.';
              actionableImprovements.push("Use masking tools to blackout visible ID sequences, QR codes, and text on paperwork.");
          } else if (r.includes('Security Question')) {
              return;
          } else {
              rec = `Address the following explicit system alert: ${r}`;
          }

          if (detType !== 'other') {
              finalScore -= rsk;
              detections.push({ type: detType, match: "Direct Scan", risk: rsk, description: r, illEffect: effect });
              if (!recommendations.includes(rec)) recommendations.push(rec);
          }
      });
    }

    // -------------------------------------------------------------
    // ADVANCED BEHAVIORAL & IMPLICIT CONTEXT LOGIC (FUSION ENGINE)
    // -------------------------------------------------------------
    
    // Digital Blackmail & Threat Overlay (Email/Password Combo)
    if (hasEmail || hasPhone) {
         finalScore -= 20;
         detections.push({
            type: 'sensitive', match: 'Digital Blackmail Risk', risk: 20,
            description: "Primary Identity Leak Escalation",
            illEffect: "Deep Fake Extortion: Exposing primary emails/phones gives hackers direct channels to send synthesized deepfakes of you to your contacts, demanding ransom."
         });
         actionableImprovements.push("Never tie personal identifiers to public social media bios to prevent targeted extortion.");
    }

    // Security Question Implicit Leak 
    if (hasSecurityHints || data.reason?.includes('Security Question')) {
        finalScore -= 30;
        detections.push({
            type: 'sensitive', match: 'Implicit Vulnerability', risk: 30,
            description: "Potential security question payload detected (pet, hometown, birthday)",
            illEffect: "Attacker Inference: Scrapers harvest these exact nouns to automatically brute-force 'Forgot My Password' verification challenges."
        });
        actionableImprovements.push("Remove specific names and dates (e.g., 'dog is 6 today' -> 'celebrating my pet').");
    }

    // Spam & Phishing Risk based on Travel/Shopping
    if ((hasTravel || hasShopping) && params.isPublic) {
        finalScore -= 10;
        detections.push({
            type: 'other', match: 'Phishing Target Acquired', risk: 10,
            description: "E-Commerce / Travel Scam Trajectory",
            illEffect: "Semantic Correlation: Posting about traveling or shopping triggers automated spam bots. Hackers will reply with malicious 'Airline Refund' or 'Order Tracking' phishing links targeting your urgent state."
        });
        actionableImprovements.push("Ignore and delete unsolicited replies offering 'customer support' or 'refund links' after posting this.");
    }

    // Temporal/Location Physical Risk Fix (Check strictly for intentional UI Location Tag)
    if (params.hasLocationTag) {
        let riskValue = 20;
        let desc = "Geolocation Mapping";
        let impact = "Confirmed geographical coordinates broadcast exact whereabouts.";
        
        if (hasTravel && params.isPublic) {
            riskValue = 40;
            desc = "Critical Threat: Geoposition + Travel Signature";
             impact = "Attacker Inference: Location data combined with travel semantics signals residential vacancy, drastically scaling Burglary risks.";
            actionableImprovements.push("Wait until you arrive home before assigning location tags to your transit albums.");
        }
        
        finalScore -= riskValue;
        detections.push({ type: 'location', match: 'Context Link', risk: riskValue, description: desc, illEffect: impact });
        recommendations.push("Physical OpSec: Strip all location pins on real-time transit.");
    }

    // Behavioral Pattern (Hacker View: Frequent -> Pattern Tracking)
    if (params.isFrequent && params.isPublic) {
        finalScore -= 10;
        detections.push({
            type: 'other', match: 'Behavioral Analysis', risk: 10,
            description: "High-Frequency Public Interaction Tracker",
            illEffect: "Attacker Inference: Constant algorithmic updating provides a hyper-accurate heatmap of victim operations, enabling highly synchronized spear-phishing."
        });
    }

    // -------------------------------------------------------------
    // SOCIAL PLATFORM SPECIFIC INTELLIGENCE
    // -------------------------------------------------------------
    
    if (params.platform === "Instagram") {
         if (params.hasImage && hasCorporateHints && !isAIImage) {
             finalScore -= 5;
             detections.push({
                 type: 'document', match: 'Environmental Risk', risk: 5,
                 description: "Visual Environment Exposure",
                 illEffect: "Attacker Inference: High resolution imagery inherently exposes background workstation blueprints, monitors, window reflections, or peripheral PII on desks."
             });
             actionableImprovements.push("Crop out monitors and desk paperwork before publishing workspace aesthetic pictures.");
         }
    }

    if ((params.platform === "Twitter" || params.platform === "X") && params.hasLocationTag) {
        finalScore -= 15;
        detections.push({
            type: 'location', match: 'Platform Threat', risk: 15,
            description: "Unfiltered Real-Time X/Twitter Syndication",
            illEffect: "Attacker Inference: X API firehoses stream geolocation metrics instantaneously to scraping fleets. Your position is actively indexed by malicious actors."
        });
    }

    if (params.platform === "LinkedIn") {
         if (hasCorporateHints || hasDocument) {
             finalScore -= 25;
             detections.push({
                 type: 'sensitive', match: 'Corporate Escalation', risk: 25,
                 description: "Role-Based / Corporate Spear-Phishing Material",
                 illEffect: "Attacker Inference: Specific company naming or ID drops (Office Pic -> Company Info) gives B2B attackers exact employee network mapping to deploy lateral network attacks."
             });
         }
    }

    if (params.platform === "Facebook") {
         if (hasSecurityHints || hasFace) {
             recommendations.push("Facebook Threat Correlation: Attackers combine Facebook family mapping with your leaked biometric/security data for sophisticated identity theft packages.");
         }
    }

    // Process scraping failure gracefully
    if (data.reason?.includes("Scraping failed")) {
      recommendations.push("Scraper bypassed anti-bot layers successfully but found no readable graph context.");
    }

    if (finalScore === 100 && detections.length === 0) {
      recommendations.push("Perfect Operations Security! No contextual or structural semantic vulnerabilities detected. Safe to broadcast, but for private posts Ensure that only trustable people follows you");
    }

    // Floor validation
    finalScore = Math.max(0, finalScore);
    const calculatedLevel = finalScore < 40 ? 'High Risk' : finalScore < 70 ? 'Moderate Risk' : 'Safe';

    return {
      score: finalScore,
      level: calculatedLevel,
      detections,
      recommendations: Array.from(new Set(recommendations)), 
      contentSummary,
      actionableImprovements: Array.from(new Set(actionableImprovements)),
      originalText: params.text
    };

  } catch (error) {
    console.error("Backend Connection Error:", error);
    return {
      score: 0,
      level: 'High Risk',
      detections: [{ 
        type: 'other', 
        match: 'System Offline', 
        risk: 100, 
        description: 'API Connection Failed', 
        illEffect: `Network Error: ${error instanceof Error ? error.message : "Connection Refused"}` 
      }],
      recommendations: [
        "Network Failed: Could not reach the FastAPI backend at 127.0.0.1:8000.",
        "Fix: Ensure your server is active by running: uvicorn main:app --reload --host 127.0.0.1 --port 8000"
      ],
      contentSummary: "Failed to parse content. Network Unreachable.",
      actionableImprovements: ["Re-verify backend APIs and network tunneling.", "Check uvicorn logs for internal crashes."],
      originalText: params.text
    };
  }
};