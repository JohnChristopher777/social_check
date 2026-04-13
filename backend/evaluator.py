import os
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from text_analyzer import TextAnalyzer

# Ensure evaluation directory exists and is cleanly managed
EVAL_DIR = os.path.join(os.path.dirname(__file__), "evaluations")
os.makedirs(EVAL_DIR, exist_ok=True)

# Instantiating the engine statically
engine = TextAnalyzer()

# A robust evaluation dataset encompassing various edge cases
DATASET = [
    {"text": "Just ate an amazing apple pie at the new bakery in town!", "true_vulnerable": False},
    {"text": "Excited to travel to London tomorrow! Flight leaves from JFK.", "true_vulnerable": True},  # Location
    {"text": "If anyone needs to reach me, my email is admin@company.com", "true_vulnerable": True}, # Email
    {"text": "Here is my contact info: +1-555-555-0198 call me anytime.", "true_vulnerable": True}, # Phone
    {"text": "My dog's name is Fluffy and he is the best! Password is not fluffy lol.", "true_vulnerable": True}, # Security Question
    {"text": "Loving the weather today, so sunny!", "true_vulnerable": False},
    {"text": "Reviewing standard compliance documents all day. No fun.", "true_vulnerable": False},
    {"text": "I can't believe it's been 10 years since my first car, a Honda Civic.", "true_vulnerable": True}, # Security Question
    {"text": "Hit me up on discord or signal, not sharing numbers.", "true_vulnerable": False},
    {"text": "Heading to the office building downtown for the new company badge.", "true_vulnerable": True}, # Corporate Phishing
    {"text": "Working from 192.168.1.1 on the internal server, deploying at 3 AM.", "true_vulnerable": True}, # IP Leak
]

def run_evaluation():
    print("Initiating Social Check AI Model Evaluation Suite...")
    y_true = []
    y_pred = []
    
    print("-" * 50)
    for item in DATASET:
        true_label = item["true_vulnerable"]
        y_true.append(1 if true_label else 0)
        
        # Pass to the engine
        results = engine.analyze(item["text"])
        
        # If any deductions occurred, the engine predicted it as vulnerable (1)
        predicted = 1 if results["score_deductions"] > 0 else 0
        y_pred.append(predicted)
        
        match_status = "✅ MATCH" if (predicted == 1 and true_label) or (predicted == 0 and not true_label) else "❌ FAIL"
        print(f"[{match_status}] Ground Truth: {true_label} | Predicted: {predicted == 1} | Text: {item['text'][:40]}...")

    print("-" * 50)
    # 1. Calculate Metrics
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    
    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(f"Accuracy:  {acc:.2f}")
    print(f"Precision: {prec:.2f}")
    print(f"Recall:    {rec:.2f}")
    print(f"F1 Score:  {f1:.2f}")
    
    # 2. Confusion Matrix Visualization
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6,5))
    sns.heatmap(cm, annot=True, fmt='d', cmap="Purples", xticklabels=['Safe', 'Vulnerable'], yticklabels=['Safe', 'Vulnerable'])
    plt.ylabel('Ground Truth')
    plt.xlabel('AI Engine Prediction')
    plt.title('AI Threat Detection Confusion Matrix')
    
    # Save safely to evaluations folder
    plot_path = os.path.join(EVAL_DIR, "confusion_matrix.png")
    plt.savefig(plot_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"\n[+] Visualization saved successfully to: {plot_path}")
    
    # Save metrics payload to JSON
    metrics_path = os.path.join(EVAL_DIR, "latest_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump({"accuracy": acc, "precision": prec, "recall": rec, "f1_score": f1}, f, indent=4)
    print(f"[+] Metrics JSON saved successfully to: {metrics_path}")

if __name__ == "__main__":
    run_evaluation()
