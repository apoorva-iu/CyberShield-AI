import os
import re
import pickle
import requests
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np
import easyocr
import pandas as pd
from urllib.parse import urlparse

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "4"
torch.set_num_threads(4)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ============================================================================
# Model Paths
# ============================================================================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ai_models", "url_phishing", "notebooks"))
PTH_PATH = os.path.join(BASE_DIR, "best_multimodal_phishnet.pth")
TFIDF_PATH = os.path.join(BASE_DIR, "multimodal_tfidf.pkl")
XGB_PATH = os.path.join(BASE_DIR, "cybershield_xgb_model.pkl")
FEAT_PATH = os.path.join(BASE_DIR, "cybershield_features.pkl")

# Dynamic Decision Thresholds
PHISH_THRESHOLD = 0.35
CRITICAL_THRESHOLD = 0.70
MODERATE_THRESHOLD = 0.20

URL_FUSION_WEIGHT = 0.55
IMAGE_FUSION_WEIGHT = 0.45

# ============================================================================
# Multimodal Vision Model Architecture
# ============================================================================
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


# Load Weights & Models
vision_model = MultimodalPhishNet(text_feature_dim=500).to(device)
if os.path.exists(PTH_PATH):
    vision_model.load_state_dict(torch.load(PTH_PATH, map_location=device))
    vision_model.eval()

vectorizer = None
if os.path.exists(TFIDF_PATH):
    with open(TFIDF_PATH, "rb") as f:
        vectorizer = pickle.load(f)

xgb_model = None
feature_names = None
if os.path.exists(XGB_PATH) and os.path.exists(FEAT_PATH):
    with open(XGB_PATH, "rb") as f:
        xgb_model = pickle.load(f)
    with open(FEAT_PATH, "rb") as f:
        feature_names = pickle.load(f)

ocr_reader = easyocr.Reader(['en'], gpu=False, quantize=True, verbose=False)

inference_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def optimize_image_for_ocr(img: Image.Image, max_dim=1400) -> np.ndarray:
    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.BILINEAR)
    return np.array(img.convert("RGB"))


def extract_url_from_text(text):
    """
    Dynamically extracts URLs or domains from OCR text, handling OCR typos like .con -> .com.
    """
    if not text:
        return None

    cleaned = text
    # Fix standard OCR character misreads in URLs
    cleaned = re.sub(r'\bnttps?[:\sIl|/]+', 'http://', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\bhttps?[:\sIl|/]+', 'http://', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'([a-zA-Z0-9-]{3,})[.\s](con|c0m|corm)\b', r'\1.com', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'([a-zA-Z0-9-]{3,})\s+(xyz|top|site|com|net|org|io|club|online|live)\b', r'\1.\2', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'([a-zA-Z0-9-]{3,})\.(xyz|top|site|com|net|org|io|club|online|live)ll?', r'\1.\2/', cleaned, flags=re.IGNORECASE)

    # 1. Standard full URL match
    standard_match = re.findall(r'(https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?)', cleaned, re.IGNORECASE)
    if standard_match:
        url = standard_match[0].strip("',;<>(){}[]\"")
        return url.replace("ll", "/").replace("Il", "/")

    # 2. Hostname pattern extraction
    tlds = "xyz|top|site|online|live|com|net|org|club|tech|app|io|biz|ru|cn|in|edu|gov"
    domain_match = re.findall(rf'\b([a-zA-Z0-9.-]+\.(?:{tlds})(?:/[^\s]*)?)\b', cleaned, re.IGNORECASE)
    if domain_match:
        url = domain_match[0].strip("',;<>(){}[]\"")
        return f"http://{url.replace('ll', '/').replace('Il', '/')}"

    return None


def verify_live_url_existence(url_string):
    """Actively checks if a domain/URL exists via real DNS/HTTP socket reachability."""
    raw_url = str(url_string).strip("[]'\" ()<>{}").strip()
    if not raw_url.startswith(('http://', 'https://')):
        raw_url = 'https://' + raw_url

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    try:
        response = requests.head(raw_url, headers=headers, timeout=3.5, allow_redirects=True)
        status = response.status_code
        if status in [403, 405]:
            response = requests.get(raw_url, headers=headers, timeout=3.5, stream=True)
            status = response.status_code

        if status == 404:
            return {
                "exists": False,
                "status_code": 404,
                "status_label": "NOT_FOUND",
                "message": "Domain is reachable, but this specific page path does NOT exist (HTTP 404 Not Found)."
            }
        elif status == 200:
            return {
                "exists": True,
                "status_code": 200,
                "status_label": "ONLINE",
                "message": "Page confirmed active and responding on live web (HTTP 200 OK)."
            }
        elif status >= 500:
            return {
                "exists": False,
                "status_code": status,
                "status_label": "SERVER_ERROR",
                "message": f"Target server returned a server-side error (HTTP {status})."
            }
        else:
            return {
                "exists": True,
                "status_code": status,
                "status_label": "ACTIVE_REDIRECT",
                "message": f"Server responded with status code HTTP {status}."
            }
    except requests.exceptions.ConnectionError:
        return {
            "exists": False,
            "status_code": 0,
            "status_label": "DOMAIN_UNRESOLVED",
            "message": "DNS resolution failed. This domain/server is not registered, fake, or dead."
        }
    except requests.exceptions.Timeout:
        return {
            "exists": False,
            "status_code": 408,
            "status_label": "REQUEST_TIMEOUT",
            "message": "Target server timed out and failed to respond."
        }
    except Exception as e:
        return {
            "exists": False,
            "status_code": -1,
            "status_label": "UNREACHABLE",
            "message": f"Failed to connect: {str(e)}"
        }


# ============================================================================
# Step 40 Exact Feature Set C Extraction
# ============================================================================
def extract_set_c_features(url_string):
    raw_url = str(url_string).strip("[]'\" ()<>{}").strip()
    clean_target = raw_url
    if not clean_target.startswith(('http://', 'https://')):
        clean_target = 'http://' + clean_target

    parsed = urlparse(clean_target)
    domain = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
    clean_domain = domain.split(':')[0]

    url_len = len(raw_url)
    dom_len = len(clean_domain)
    is_https = 1 if parsed.scheme == 'https' or raw_url.startswith('https://') else 0

    subdomains = clean_domain.split('.')
    no_of_subdomains = max(0, len(subdomains) - 2) if len(subdomains) > 2 else 0

    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    is_domain_ip = 1 if re.match(ip_pattern, clean_domain) else 0

    no_letters = sum(c.isalpha() for c in raw_url)
    no_digits = sum(c.isdigit() for c in raw_url)
    no_amp = raw_url.count('&')
    no_qmark = raw_url.count('?')
    no_equals = raw_url.count('=')

    total_non_alnum = sum(1 for c in raw_url if not c.isalnum())
    no_special_chars = max(0, total_non_alnum - (no_amp + no_qmark + no_equals))

    letter_ratio = no_letters / url_len if url_len > 0 else 0
    digit_ratio = no_digits / url_len if url_len > 0 else 0
    special_char_ratio = no_special_chars / url_len if url_len > 0 else 0

    obfuscated_chars = len(re.findall(r'%[0-9a-fA-F]{2}', raw_url))
    has_obfuscation = 1 if obfuscated_chars > 0 else 0
    obfuscation_ratio = obfuscated_chars / url_len if url_len > 0 else 0

    tld = subdomains[-1] if len(subdomains) > 0 else ""
    tld_len = len(tld)

    tld_legit_prob = 0.85 if tld.lower() in ['com', 'org', 'edu', 'gov', 'net', 'io'] else 0.35
    url_char_prob = letter_ratio
    char_continuation_rate = 0.50

    feature_dict = {
        'URLLength': url_len,
        'DomainLength': dom_len,
        'IsHTTPS': is_https,
        'NoOfSubDomain': no_of_subdomains,
        'IsDomainIP': is_domain_ip,
        'NoOfLettersInURL': no_letters,
        'NoOfDegitsInURL': no_digits,
        'NoOfOtherSpecialCharsInURL': no_special_chars,
        'LetterRatioInURL': letter_ratio,
        'DegitRatioInURL': digit_ratio,
        'SpacialCharRatioInURL': special_char_ratio,
        'NoOfAmpersandInURL': no_amp,
        'NoOfQMarkInURL': no_qmark,
        'NoOfEqualsInURL': no_equals,
        'HasObfuscation': has_obfuscation,
        'NoOfObfuscatedChar': obfuscated_chars,
        'ObfuscationRatio': obfuscation_ratio,
        'TLDLength': tld_len,
        'TLDLegitimateProb': tld_legit_prob,
        'URLCharProb': url_char_prob,
        'CharContinuationRate': char_continuation_rate,
        '_clean_domain': clean_domain,
        '_clean_url': raw_url
    }
    return feature_dict


def predict_url_risk(url):
    """Predicts phishing risk strictly through the trained XGBoost model."""
    if not url or xgb_model is None or feature_names is None:
        return 0.0, {}
    try:
        raw_feats = extract_set_c_features(url)
        input_df = pd.DataFrame([raw_feats])[feature_names]

        # Extract probability directly from trained XGBoost model
        proba_row = xgb_model.predict_proba(input_df)[0]
        prob = float(proba_row[1])

        return min(1.0, max(0.0, prob)), raw_feats
    except Exception as e:
        print("XGB Prediction Error:", e)
        return 0.0, {}


def fuse_scores(vision_prob, url_prob, has_image, has_url):
    """Fuses model probabilities dynamically without hardcoded score overrides."""
    if has_image and has_url:
        blended = (vision_prob * IMAGE_FUSION_WEIGHT) + (url_prob * URL_FUSION_WEIGHT)
        if max(vision_prob, url_prob) >= CRITICAL_THRESHOLD:
            return max(vision_prob, url_prob)
        return blended
    elif has_image:
        return vision_prob
    elif has_url:
        return url_prob
    return 0.0


def build_concrete_explanation(has_image, has_url, vision_prob, url_prob, raw_feats, ocr_text, live_check):
    findings = []

    # 1. Live Reachability
    if live_check:
        status_label = live_check.get("status_label", "UNKNOWN")
        is_alive = live_check.get("exists", False)
        findings.append({
            "type": "safe" if is_alive else ("threat" if status_label == "DOMAIN_UNRESOLVED" else "neutral"),
            "title": f"Network Reachability: {status_label}",
            "description": live_check.get("message", "Network diagnostic recorded.")
        })

    # 2. ResNet-18 + TF-IDF Model Analysis
    if has_image:
        top_tokens = []
        if vectorizer is not None and ocr_text and ocr_text.strip() != "empty_text":
            try:
                feature_array = np.array(vectorizer.get_feature_names_out())
                tfidf_vec = vectorizer.transform([ocr_text]).toarray()[0]
                tfidf_sorting = np.argsort(tfidf_vec)[::-1]
                top_tokens = [feature_array[i] for i in tfidf_sorting[:3] if tfidf_vec[i] > 0]
            except Exception:
                top_tokens = []

        if vision_prob >= PHISH_THRESHOLD:
            token_context = f" Dominant semantic tokens learned by TF-IDF: [{', '.join(repr(t) for t in top_tokens)}]." if top_tokens else ""
            findings.append({
                "type": "threat",
                "title": "Visual & Text Model (ResNet-18 + TF-IDF)",
                "description": f"Neural vision backbone scored layout structure at {round(vision_prob * 100, 1)}% threat probability.{token_context}"
            })
        else:
            findings.append({
                "type": "safe",
                "title": "Visual & Text Model (ResNet-18 + TF-IDF)",
                "description": f"Visual composition aligns with legitimate site patterns ({round((1 - vision_prob) * 100, 1)}% safety confidence)."
            })

    # 3. XGBoost Model Analysis
    if has_url and raw_feats:
        domain = raw_feats.get('_clean_domain', 'Target')
        active_cues = []
        if raw_feats.get('IsDomainIP', 0) == 1:
            active_cues.append("IsDomainIP=1")
        if raw_feats.get('NoOfSubDomain', 0) > 0:
            active_cues.append(f"Subdomains={raw_feats.get('NoOfSubDomain')}")
        if raw_feats.get('NoOfDegitsInURL', 0) > 2:
            active_cues.append(f"DigitsInURL={raw_feats.get('NoOfDegitsInURL')}")
        if raw_feats.get('IsHTTPS', 0) == 0:
            active_cues.append("Protocol=HTTP")

        cue_summary = f" (Active Features: {', '.join(active_cues)})" if active_cues else ""

        if url_prob >= PHISH_THRESHOLD:
            findings.append({
                "type": "threat",
                "title": f"XGBoost Classifier: {domain}",
                "description": f"Model evaluated 21 lexical Set-C features, outputting {round(url_prob * 100, 1)}% threat probability.{cue_summary}"
            })
        else:
            findings.append({
                "type": "safe",
                "title": f"XGBoost Classifier: {domain}",
                "description": f"Lexical feature distributions are within standard safe bounds ({round((1 - url_prob) * 100, 1)}% confidence)."
            })

    return findings


def scan_full_pipeline(image_path=None, explicit_url=None):
    vision_prob = 0.0
    ocr_text = ""
    target_url = explicit_url
    raw_feats = {}
    live_check = None

    has_image = bool(image_path and os.path.exists(image_path))
    has_explicit_url = bool(explicit_url and len(str(explicit_url).strip()) > 0)

    # 1. Visual & OCR Analysis (ResNet-18 + TF-IDF Head)
    if has_image:
        raw_img = Image.open(image_path)
        tensor_img = inference_transforms(raw_img.convert("RGB")).unsqueeze(0).to(device)

        fast_ocr_np = optimize_image_for_ocr(raw_img)
        lines = ocr_reader.readtext(fast_ocr_np, detail=0, paragraph=True)
        ocr_text = " ".join(lines).strip()
        processed_text = ocr_text if ocr_text else "empty_text"

        if vectorizer is not None and vision_model is not None:
            text_vec = vectorizer.transform([processed_text]).toarray()[0]
            tensor_text = torch.tensor(text_vec, dtype=torch.float32).unsqueeze(0).to(device)
            with torch.inference_mode():
                # Direct sigmoid probability from trained PyTorch multimodal weights
                vision_prob = float(torch.sigmoid(vision_model(tensor_img, tensor_text)).item())

        # Dynamically extract URL from screenshot address bar if not manually typed
        if not target_url:
            extracted = extract_url_from_text(ocr_text)
            if extracted:
                target_url = extracted

    # 2. Domain & URL Analysis (Trained XGBoost + Live DNS Reachability)
    url_prob = 0.0
    has_target_url = bool(target_url and len(str(target_url).strip()) > 0)
    if has_target_url:
        live_check = verify_live_url_existence(target_url)
        url_prob, raw_feats = predict_url_risk(target_url)

    # 3. Multi-modal Probability Fusion
    composite_risk = fuse_scores(vision_prob, url_prob, has_image, has_target_url)

    # 4. Model Explanations & Reasoning
    diagnostic_insights = build_concrete_explanation(
        has_image=has_image,
        has_url=has_target_url,
        vision_prob=vision_prob,
        url_prob=url_prob,
        raw_feats=raw_feats,
        ocr_text=ocr_text,
        live_check=live_check
    )

    # 5. Autonomous Verdict Logic (Live DNS Failure or Model Probability)
    if live_check and not live_check["exists"]:
        if live_check["status_label"] == "DOMAIN_UNRESOLVED":
            verdict = "PHISHING / FAKE DOMAIN DETECTED"
            threat_level = "CRITICAL"
            composite_risk = max(composite_risk, 0.95)
        elif live_check["status_label"] == "NOT_FOUND":
            verdict = "PAGE NOT FOUND (404)"
            threat_level = "MODERATE"
        else:
            verdict = "DEAD / UNREACHABLE LINK"
            threat_level = "MODERATE"
    elif composite_risk >= PHISH_THRESHOLD:
        verdict = "PHISHING DETECTED"
        threat_level = "CRITICAL" if composite_risk >= CRITICAL_THRESHOLD else "HIGH"
    else:
        verdict = "LEGITIMATE / SAFE"
        threat_level = "LOW"

    return {
        "verdict": verdict,
        "threat_level": threat_level,
        "composite_risk_score": round(composite_risk * 100, 1),
        "visual_risk_score": round(vision_prob * 100, 1) if has_image else None,
        "domain_risk_score": round(url_prob * 100, 1) if has_target_url else None,
        "analyzed_url": target_url if has_target_url else None,
        "live_url_check": live_check,
        "ocr_detected_text": ocr_text if ocr_text else None,
        "diagnostic_insights": diagnostic_insights,
        "input_types": {
            "has_image": has_image,
            "has_url": has_target_url,
            "is_url_from_ocr": bool(has_image and not has_explicit_url and has_target_url)
        }
    }