# AI-Powered Social Media Cyber Risk Exposure Analysis Tool
## Full System Architecture & Project Documentation

### 1. Core Objective & Scope
This project is an advanced, client-side Risk Assessment Engine. It analyzes digital footprints (text snippets, social media URLs, image metadata contexts) to compute a vulnerability score. 

The score starts at a perfect **100 (Fully Secure)**. Points are deducted based on detected vulnerabilities, mapped to their specific real-world consequences and actual hacker methodologies. The final output classifies the footprint into three severity tiers: **Safe (100-80)**, **Moderate Risk (79-40)**, or **High Risk (<40)**.

### 2. User Interface (React Bits Aesthetic - Mobile Responsive)
The UI has been entirely overhauled to mirror top-tier modern developer portals. Key features include:
- **Liquid Aura Background**: We use CSS custom animations (`animate-blob`) on absolute `mix-blend-screen` divisions simulating liquid flowing plasma in ultra-vibrant colors (Purple, Cyan, Blue).
- **Responsive Architecture**: Fully refactored Tailwind classes (using `md:` and `lg:` breakpoints) to ensure the UI stacks perfectly on mobile screens, utilizing `flex-col` for inputs on narrow viewports while expanding to a `grid-cols-12` dashboard layout on desktop workspaces.
- **Glassmorphism Panels**: Deep `backdrop-blur-3xl` panels with high contrast borders (`border-white/10`) provide exceptional text visibility against `#05050A` and `#0A001F` dark mode bases, ensuring WCAG contrast compliance.
- **Micro-Animations**: Framer Motion handles the sweeping scans, spinner logic, pulsing indicators, and fluid transitions between the empty state, the scanning phase, and the result dashboard.
- **Verified Branding**: Utilizing the `logo.png` (Verified Tick) consistently on the favicon, `Splash.tsx`, and the `App.tsx` navigation bar.

### 3. Text, URL, & Behavioral Content Analysis
Our updated `ai.ts` module uses enhanced Regular Expressions and context arrays to perform analysis. A core feature of version 3 is explicitly explaining **How Hackers Attack**:
- **Contact Info Scraping (SMS Phishing/Credential Stuffing)**: Finding emails and phone numbers triggers alerts regarding "Smishing" attacks (automated malicious texts) and botnet credential stuffing. 
- **URL Vulnerability**: If users submit raw public links (e.g., `instagram.com/p/...`), the engine identifies the risk of OSINT (Open-Source Intelligence) bots scraping the graph API to find followers, enabling social engineering impersonation attacks against close friends.
- **Named Entity Recognition (Physical Burglary/Ransom)**: Cross-referencing inputs like "airport," "flight," "home," or explicit map geo-tags. Output explicitly warns that criminals monitor active locations to coordinate burglaries of empty homes.
- **Security Questions (Account Takeovers)**: The engine detects context around "pets" or "kids names" and warns users that hackers use OSINT to click "Forgot Password" to answer security questions directly scraped from user feeds.

### 4. Image & Video Analysis Flow
Because the current application is a frontend prototype, we simulate computer vision by validating user inputs against context indicators.
- **Background Exploitation**: If context implies a desk or new job, the engine warns about attackers zooming into background monitors in imagery to snatch passwords off sticky notes or account numbers off mail.
- **Barcode & Document Extraction**: Mentions of tickets trigger warnings about hackers using free barcode scanners on images to pull explicit PNRs, allowing them to cancel flights manually.

### 5. Deployment & Scalability Configuration
- **Netlify Ready**: The project includes a `_redirects` file (`/* /index.html 200`) specifically built to support Vite React Single Page Application (SPA) routing, ensuring 404 errors do not occur upon direct URL accesses in production.
- **Module Structure**: Complete separation of concerns:
  - `/src/components/Splash.tsx` - App loading state
  - `/src/components/Aura.tsx` - GPU-accelerated backdrop animations
  - `/src/services/ai.ts` - Standalone stateless async risk engine
  - `/src/App.tsx` - Layout and orchestrator

### 6. Summary of Delivered Features
- Fixed all IDE parameter errors (`url` is now parsed and factored into the AI scoring algorithms).
- Total UI aesthetic update (highly visible text, functional liquid gradient animations, proper blue logo placements).
- Robust sample sets built precisely to demonstrate boundaries (A `100` score perfect OpSec post, and a `0` score total exposure post).
- Hacker logic translations translating standard "privacy risks" into actionable, terrifying real-world criminal scenarios for layman understanding.
