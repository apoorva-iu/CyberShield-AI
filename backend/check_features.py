import pickle
import os

FEAT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai_models", "url_phishing", "notebooks", "cybershield_features.pkl"))

with open(FEAT_PATH, "rb") as f:
    features = pickle.load(f)

print(f"Total Features Expected: {len(features)}")
print("Feature Column Names:")
print(features)