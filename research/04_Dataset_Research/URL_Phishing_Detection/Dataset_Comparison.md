# URL Phishing Dataset Comparison

## Objective

# URL Phishing Dataset Comparison

## Objective

Compare multiple phishing website datasets and select the most suitable datasets for the URL Phishing AI module of CyberShield-AI.

| Criteria | Candidate 1 | Candidate 2 | Candidate 3 |
|----------|-------------|-------------|-------------|
| Dataset | PhiUSIIL Phishing URL | Web Page Phishing Detection | Phishing Sites Screenshot |
| Source | Kaggle | Kaggle | Kaggle |
| Kaggle Owner | KagglePro LLC | Shashwat Work | ZACKY_ZAC |
| Original Source | UCI (PhiUSIIL) | Mendeley Data | Hugging Face |
| Dataset Type | Structured | Structured | Image Dataset |
| Purpose | URL & Domain Analysis | HTML & Webpage Analysis | Screenshot Analysis |
| Records | 235,795 | 11,430 | Image Collection |
| Features | 54 | 87 | PNG Screenshots |
| Data Modalities | URL + Domain + Webpage | URL + HTML + Webpage | Website Images |
| File Format | CSV | CSV | PNG |
| Target Classes | Legitimate / Phishing | Legitimate / Phishing | Genuine / Phishing |
| Real-World Data | ✅ Yes | ✅ Yes | ✅ Yes |
| ML Ready | ✅ Excellent | ✅ Excellent | ❌ No |
| DL Ready | ✅ Yes | ✅ Yes | ✅ Excellent |
| Computer Vision | ❌ No | ❌ No | ✅ Yes |
| Explainable AI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ |
| Image Support | ❌ No | ❌ No | ✅ Yes |
| URL Analysis | ✅ Yes | ✅ Yes | ❌ No |
| HTML Analysis | ✅ Yes | ✅ Yes | ❌ No |
| Visual Analysis | ❌ No | ❌ No | ✅ Yes |
| Complexity | Medium | Medium | High |
| CyberShield Role | Primary Detection | Webpage Analysis | Visual Detection |
| Overall Rating | ⭐⭐⭐⭐⭐ (10/10) | ⭐⭐⭐⭐☆ (9.5/10) | ⭐⭐⭐⭐⭐ (10/10) |
---

# Initial Observations

## Candidate 1 – PhiUSIIL

- Large-scale benchmark phishing dataset.
- Contains 235,795 website records.
- Includes 54 engineered URL, domain, and webpage features.
- Excellent for Machine Learning and Explainable AI.
- Ideal as the primary phishing detection dataset. :contentReference[oaicite:0]{index=0}

---

## Candidate 2 – Web Page Phishing Detection Dataset

- Balanced phishing and legitimate website dataset.
- Includes rich URL, HTML, and webpage characteristics.
- Complements Candidate 1 with webpage-level analysis.
- Suitable for feature engineering and Explainable AI.
- Strengthens structured phishing detection.

---

## Candidate 3 – Phishing Sites Screenshot Dataset

- Image-based phishing detection dataset.
- Contains screenshots of legitimate and phishing websites.
- Enables Computer Vision and multimodal AI.
- Supports CNNs, Vision Transformers, and OCR integration.
- Adds visual phishing detection capabilities to CyberShield-AI.

---

# Final Decision

Instead of selecting a single dataset, all three datasets have been selected because they provide complementary capabilities.

| Dataset                                       | Role                                                            |
| --------------------------------------------- | --------------------------------------------------------------- |
| **Candidate 1 (PhiUSIIL)**                    | Primary training dataset for URL and domain phishing detection. |
| **Candidate 2 (Web Page Phishing Detection)** | Secondary dataset for webpage and HTML feature analysis.        |
| **Candidate 3 (Phishing Sites Screenshot)**   | Computer Vision dataset for visual phishing website detection.  |

Together, these datasets enable CyberShield-AI to perform **multimodal phishing detection** by combining URL analysis, webpage feature analysis, and screenshot-based visual analysis. This approach improves robustness, explainability, and real-world applicability compared to relying on a single dataset. :contentReference[oaicite:1]{index=1}
