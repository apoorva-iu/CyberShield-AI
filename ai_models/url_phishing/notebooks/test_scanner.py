import os
import sys

# 1. Prevent OpenMP crash on Windows (ExitCode 3221225477)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import re
import pickle
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from urllib.parse import urlparse
import easyocr

print("=" * 65)
print("🛡️ CYBERSHIELD DUAL-ENGINE TEST SCANNER")
print("=" * 65)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using Device: {device}")

# 2. Define Multimodal Model Architecture
class MultimodalPhishNet(nn.Module):
    def __init__(self, text_feature_dim=500):
        super(MultimodalPhishNet, self).__init__()
        self.vision_backbone = models.resnet18(weights=None)
        num_features = self.vision_backbone.fc.in_features
        self.vision_backbone.fc = nn.Sequential(
            nn.Linear(num_features, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3)
        )
        self.text_backbone = nn.Sequential(
            nn.Linear(text_feature_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3)
        )
        self.fusion_classifier = nn.Sequential(
            nn.Linear(128 + 128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1)
        )

    def forward(self, image_tensor, text_tensor):
        v = self.vision_backbone(image_tensor)
        t = self.text_backbone(text_tensor)
        return self.fusion_classifier(torch.cat((v, t), dim=1))

# 3. Load Vision Model Weights & TF-IDF
vision_model = MultimodalPhishNet(text_feature_dim=500).to(device)
vision_model.load_state_dict(torch.load("best_multimodal_phishnet.pth", map_location=device))
vision_model.eval()

with open("multimodal_tfidf.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# 4. Load URL XGBoost Model & Features (Model 1)
xgb_model = None
feature_names = None
if os.path.exists("cybershield_xgb_model.pkl") and os.path.exists("cybershield_features.pkl"):
    with open("cybershield_xgb_model.pkl", "rb") as f:
        xgb_model = pickle.load(f)
    with open("cybershield_features.pkl", "rb") as f:
        feature_names = pickle.load(f)
    print("✅ Model 1 (URL XGBoost) & Model 2 (Vision/OCR) Ready.")
else:
    print("✅ Model 2 (Vision/OCR) Ready (Using URL heuristic analyzer).")

# 5. Initialize OCR & Image Transformations
ocr_reader = easyocr.Reader(['en'], gpu=False, quantize=True, verbose=False)
inference_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 6. Helper: Auto-detect URL from OCR string
def extract_url_from_text(text):
    pattern = r'(https?://[^\s/$.?#].[^\s]*|(?:\b[a-zA-Z0-9-]+\.)+(?:com|net|org|xyz|info|biz|ru|cn|top|site|online|live|tech|app|io|cc|ws|club)(?:/[^\s]*)?)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    if matches:
        url = matches[0].strip("',;<>(){}[]\"")
        return url if url.startswith("http") else "http://" + url
    return None

# 7. Helper: URL Risk Prediction
def predict_url_risk(url):
    if not url:
        return 0.0, "No URL detected"
    
    if xgb_model is not None and feature_names is not None:
        try:
            parsed = urlparse(url)
            hostname = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
            feats = {
                'url_length': len(url),
                'hostname_length': len(hostname),
                'count_dots': url.count('.'),
                'count_hyphens': url.count('-'),
                'count_at': url.count('@'),
                'count_question': url.count('?'),
                'count_percent': url.count('%'),
                'count_equal': url.count('='),
                'count_http': url.count('http'),
                'count_https': url.count('https'),
                'count_www': url.count('www'),
                'count_digits': sum(c.isdigit() for c in url),
                'count_letters': sum(c.isalpha() for c in url),
                'count_dir': parsed.path.count('/'),
                'has_ip': 1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', hostname) else 0,
                'has_login': 1 if "login" in url.lower() else 0,
                'has_verify': 1 if "verify" in url.lower() else 0,
                'has_auth': 1 if "auth" in url.lower() else 0,
                'has_portal': 1 if "portal" in url.lower() else 0,
                'has_secure': 1 if "secure" in url.lower() else 0,
                'has_account': 1 if "account" in url.lower() else 0,
                'has_update': 1 if "update" in url.lower() else 0,
            }
            df = pd.DataFrame([feats])
            for col in feature_names:
                if col not in df.columns:
                    df[col] = 0
            prob = float(xgb_model.predict_proba(df[feature_names])[0][1])
            return prob, "XGBoost URL Engine"
        except Exception:
            pass

    # Heuristic Fallback
    url_lower = url.lower()
    score = 0.10
    flags = []
    suspicious = ["login", "verify", "auth", "portal", "account", "secure", "update", "service", "banking", "job"]
    matches = [k for k in suspicious if k in url_lower]
    if matches:
        score += 0.35 * len(matches)
        flags.append(f"Keywords: {matches}")
    if url_lower.count("-") >= 2:
        score += 0.30
        flags.append("Multiple hyphens")
    return min(score, 1.0), " | ".join(flags) if flags else "Standard domain pattern"

# 8. Master Scan Function
def scan_image(image_path, manual_url=None):
    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        return

    # Vision Input
    raw_img = Image.open(image_path).convert("RGB")
    tensor_img = inference_transforms(raw_img).unsqueeze(0).to(device)

    # High-Res OCR
    img_np = np.array(raw_img)
    lines = ocr_reader.readtext(img_np, detail=0, paragraph=True)
    ocr_text = " ".join(lines).strip()
    processed_text = ocr_text if ocr_text else "empty_text"

    # Multimodal Vision Model Output
    text_vec = vectorizer.transform([processed_text]).toarray()[0]
    tensor_text = torch.tensor(text_vec, dtype=torch.float32).unsqueeze(0).to(device)
    with torch.no_grad():
        vision_prob = torch.sigmoid(vision_model(tensor_img, tensor_text)).item()

    # URL Model Output
    detected_url = manual_url if manual_url else extract_url_from_text(processed_text)
    url_prob, url_info = predict_url_risk(detected_url)

    # Fail-Safe Ensemble
    is_fake = (vision_prob >= 0.50) or (url_prob >= 0.50)
    if is_fake:
        verdict = "🚨 FAKE / PHISHING DETECTED"
        threat_level = "CRITICAL" if (vision_prob > 0.70 or url_prob > 0.70) else "HIGH"
        if vision_prob >= 0.50 and url_prob >= 0.50:
            flagged_by = "Both Models (Vision + URL)"
        elif vision_prob >= 0.50:
            flagged_by = "Model 2 (Vision + OCR Engine)"
        else:
            flagged_by = "Model 1 (URL Engine)"
    else:
        verdict = "✅ LEGITIMATE / SAFE"
        threat_level = "LOW"
        flagged_by = "Both Models Cleared Site"

    print("\n" + "=" * 65)
    print(f"🖼️ File Analyzed:          {os.path.basename(image_path)}")
    print(f"📝 OCR Detected Text:      '{processed_text[:80]}...'")
    print(f"🌐 Extracted URL:          {detected_url if detected_url else '[No URL detected in image]'}")
    print("-" * 65)
    print(f"👁️ Model 2 (Vision + OCR): {vision_prob * 100:.2f}% Risk")
    print(f"🔗 Model 1 (URL Engine):   {url_prob * 100:.2f}% Risk ({url_info})")
    print("-" * 65)
    print(f"🎯 FINAL VERDICT:          [{verdict}]")
    print(f"⚠️ Threat Level:            {threat_level}")
    print(f"🔍 Detection Source:       {flagged_by}")
    print("=" * 65)


if __name__ == "__main__":
    # Test your target image here
    test_image_path = os.path.join("..", "data", "raw", "job.png")
    scan_image(test_image_path)