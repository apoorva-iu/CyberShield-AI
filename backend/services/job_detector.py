import os
import joblib
import pandas as pd

# Locate the model in the backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "cybershield_job_detector.pkl")

# Load once into memory
try:
    detector_bundle = joblib.load(MODEL_PATH)
except Exception as e:
    detector_bundle = None
    print(f"[WARN] Could not load job detector bundle: {e}")

def scan_job(job_data: dict) -> dict:
    if detector_bundle is None:
        raise RuntimeError("Model bundle not loaded. Check if cybershield_job_detector.pkl is in backend/")

    bundle = detector_bundle

    # 1. Structure text with section tags
    combined_text = (
        f"[TITLE] {job_data.get('title', '')} "
        f"[COMPANY] {job_data.get('company_profile', '')} "
        f"[DESCRIPTION] {job_data.get('description', '')} "
        f"[REQUIREMENTS] {job_data.get('requirements', '')} "
        f"[BENEFITS] {job_data.get('benefits', '')}"
    )

    # 2. Text Model inference
    X_txt = bundle["text_vectorizer"].transform([combined_text])
    raw_text_score = bundle["text_svm"].decision_function(X_txt).reshape(-1, 1)
    prob_text = float(bundle["platt_calibrator"].predict_proba(raw_text_score)[0, 1])

    # 3. Metadata Model inference
    meta_df = pd.DataFrame([job_data])
    for col in bundle["categorical_cols"]:
        if col not in meta_df.columns:
            meta_df[col] = "MISSING_VALUE"

    X_meta = bundle["meta_preprocessor"].transform(meta_df[bundle["categorical_cols"]])
    prob_meta = float(bundle["meta_model"].predict_proba(X_meta)[0, 1])

    # 4. Late fusion score
    w = bundle["optimal_w"]
    threshold = bundle["optimal_threshold"]
    final_score = (w * prob_text) + ((1.0 - w) * prob_meta)
    is_fraudulent = bool(final_score >= threshold)

    risk_level = "CRITICAL" if final_score >= 0.70 else ("SUSPICIOUS" if is_fraudulent else "SAFE")

    return {
        "is_fraudulent": is_fraudulent,
        "risk_level": risk_level,
        "risk_score": round(final_score * 100, 2),
        "text_risk": round(prob_text * 100, 2),
        "metadata_risk": round(prob_meta * 100, 2)
    }