# Social Check Model Evaluation & Testing Guide

This guide outlines exactly how to validate the Social Check AI models, ensuring our scraping efficiency, image analytics accuracy, and text logic remain highly resilient, unbiased, and effective.

## 1. Validating Image Intelligence (CV)
Our image analysis logic (`image_analyzer.py`) utilizes the highly efficient Google MediaPipe library and OpenCV to identify biological faces vs. spoof/anime.

**To manually check Image Efficiency:**
1. Supply a high-res image containing a real human face and an ID card.
2. The UI will instantly display a `Machine-readable Data` flag and `-30` points mapping to the ID card, and a `-15` point Deepfake Vulnerability mapping to the face. 
3. *Bias Reduction Check:* Upload an anime/cartoon drawing of a face. The system will **ignore it completely**, returning 100 Safe Score. MediaPipe explicitly verifies human biometrics vs. 2D illustrations, defeating false-positive alarms!

## 2. Validating Text Comprehension & Bias Reduction
Previously, the model carried an inherent semantic bias—it would immediately dock points if it rigidly read the text string `"password is "`. We have eliminated this rigid bias using RegEx contextual evaluation in `text_analyzer.py`.

**To check Text Efficiency:**
1. Try an innocent post: *"Thinking about changing my password structure to something much stronger today."*
   - **Result:** No deductions. Context acknowledges standard dialogue.
2. Try a realistic OSINT leak: *"Got my new dog today! My password for life will always be Bruno."*
   - **Result:** The engine calculates the context fusion of `"password"` + `"my dog"` triggering the `Credential Recovery Leak` heuristic alert (-40 points).

## 3. Validating the Threat Fusion Scraper
The `smart_scrape` routine in `scraper.py` interfaces with Microlink OSINT endpoints. It completely bypasses Twitter and Instagram rate-limiting.

**To Check Scraping Efficiency:**
1. Input an Instagram URL in the dashboard.
2. The backend rapidly executes an asynchronous TLS verification bypass request to grab strictly the caption description and the CDN-served image.
3. The UI seamlessly binds the actual content of the post to our engine matrix. *(If a platform blocks the scraper outright, the frontend receives a graceful 100-score safety fallback advising manual input).*

## 4. Run Quantitative Re-Evaluation Scripts
To dynamically document the precision, recall, and F1-score of the system during major updates:
1. Ensure your Virtual Environment is active.
2. Navigate to `/backend`.
3. Run the automated script:
   ```bash
   python evaluator.py
   ```
4. This drops a highly detailed visualization Matrix into `/backend/evaluations/confusion_matrix.png`, proving analytically the performance consistency of the classification engines.
