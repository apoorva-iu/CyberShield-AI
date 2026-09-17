import os
import joblib
from sentence_transformers import SentenceTransformer

# Calculate path back to notebooks where the .pkl was saved
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "..", "ai_models", "fake_job_detection", "notebooks", "cybershield_job_detector_v3.pkl")

# Local fallback if the file was moved to the backend folder
if not os.path.exists(model_path):
    model_path = os.path.join(base_dir, "cybershield_job_detector_v3.pkl")

print(f"Loading model bundle from: {model_path}...")
bundle = joblib.load(model_path)

classifier = bundle["classifier"]
threshold = bundle["decision_threshold"]

print(f"Loading transformer: {bundle['embedder_name']} on CPU...")
embedder = SentenceTransformer(bundle["embedder_name"], device="cpu")

def analyze_posting(text: str) -> dict:
    vector = embedder.encode([text.strip()], device="cpu")
    prob = float(classifier.predict_proba(vector)[0, 1])
    is_fraud = prob >= threshold
    return {
        "verdict": "🚨 FRAUD DETECTED" if is_fraud else "✅ GENUINE LISTING",
        "risk_percentage": round(prob * 100, 2),
        "threshold_used": threshold
    }

# Run quick verification test
test_listing = """
Remote Data Entry Clerk
Immediate hiring. Earn $40/hr from home with no previous experience needed.
Send your details to hr-onboarding@quickportal-jobs.com to get started today.
"""

print("\nRunning inference...")
result = analyze_posting(test_listing)
print(result)