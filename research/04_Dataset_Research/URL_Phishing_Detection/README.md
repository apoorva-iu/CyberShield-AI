# URL Phishing Detection

This folder contains dataset research for URL phishing detection components.

# URL Phishing AI Research

## Module Overview

The **URL Phishing AI** module is a core component of **CyberShield-AI**, designed to detect phishing websites using Artificial Intelligence. The module aims to identify malicious websites through multiple sources of information, including URL characteristics, webpage features, and website screenshots.

Instead of relying on a single dataset, this research evaluates multiple publicly available datasets and adopts a multimodal approach to improve detection accuracy, robustness, and explainability.

---

# Research Objectives

- Study existing phishing website datasets.
- Compare multiple benchmark datasets.
- Evaluate dataset quality and suitability.
- Select the most appropriate datasets for CyberShield-AI.
- Support Explainable AI and multimodal phishing detection.

---

# Research Methodology

The research was conducted in the following stages:

1. Dataset collection
2. Literature review
3. Dataset analysis
4. Candidate comparison
5. Final dataset selection
6. Integration planning for CyberShield-AI

---

# Candidate Datasets

## Candidate 1

### PhiUSIIL Phishing URL Dataset

- Source: Kaggle
- Type: Structured Cybersecurity Dataset
- Records: 235,795
- Features: 54
- Modality:
  - URL Features
  - Domain Features
  - Webpage Features

Purpose:

Primary dataset for URL and domain phishing detection.

Status:

✅ Selected

---

## Candidate 2

### Web Page Phishing Detection Dataset

- Source: Kaggle
- Type: Structured Cybersecurity Dataset
- Records: 11,430
- Features: 87
- Modality:
  - URL Features
  - HTML Features
  - Webpage Features

Purpose:

Secondary dataset for webpage feature analysis.

Status:

✅ Selected

---

## Candidate 3

### Phishing Sites Screenshot Dataset

- Source: Kaggle
- Type: Computer Vision Dataset
- Data Format:
  - PNG Website Screenshots

Purpose:

Visual phishing website detection using screenshots.

Status:

✅ Selected

---

# Research Files

```
URL_Phishing_AI/
│
├── Candidate_1/
│   ├── README.md
│   ├── notes.md
│   └── dataset_analysis.md
│
├── Candidate_2/
│   ├── README.md
│   ├── notes.md
│   └── dataset_analysis.md
│
├── Candidate_3/
│   ├── README.md
│   ├── notes.md
│   └── dataset_analysis.md
│
├── dataset_comparison.md
├── final_decision.md
└── README.md
```

---

# Dataset Comparison Summary

| Candidate | Primary Strength | Selected |
|------------|------------------|----------|
| Candidate 1 | URL & Domain Analysis | ✅ |
| Candidate 2 | HTML & Webpage Analysis | ✅ |
| Candidate 3 | Screenshot-Based Detection | ✅ |

---

# Why Multiple Datasets?

Each dataset contributes a different capability:

- Candidate 1 specializes in detecting phishing through URL and domain characteristics.
- Candidate 2 provides detailed webpage and HTML features that improve structured analysis.
- Candidate 3 enables computer vision-based phishing detection using website screenshots.

Combining these datasets allows CyberShield-AI to perform multimodal phishing detection instead of relying on a single source of information.

---

# Integration into CyberShield-AI

The selected datasets will support the following workflow:

### URL Analysis

Detect suspicious URLs using structured URL and domain features.

↓

### Webpage Analysis

Analyze webpage and HTML characteristics for phishing indicators.

↓

### Screenshot Analysis

Process uploaded website screenshots using computer vision techniques.

↓

### Explainable AI

Generate interpretable explanations highlighting why a website is classified as phishing or legitimate.

↓

### User Interface

Display the phishing prediction, confidence score, detected indicators, and recommendations within CyberShield-AI.

---

# Expected Outcomes

The selected datasets will enable CyberShield-AI to:

- Detect phishing websites accurately.
- Support multimodal AI.
- Improve robustness against different phishing techniques.
- Provide explainable predictions.
- Analyze both URLs and screenshots.
- Enhance cybersecurity awareness for end users.

---

# Technologies Planned

| Component | Planned Technology |
|-----------|--------------------|
| OCR | PaddleOCR / EasyOCR |
| URL Classification | DistilBERT + Feature Engineering |
| Computer Vision | CNN / Vision Transformer |
| Explainable AI | SHAP / LIME |
| AI Explanation | Gemini API |
| Backend | Flask |
| Frontend | React |
| Database | MongoDB |

---

# Final Decision

After evaluating all candidate datasets, **all three datasets have been selected** because they complement each other rather than compete with one another.

- Candidate 1 provides structured URL and domain analysis.
- Candidate 2 enhances webpage and HTML feature analysis.
- Candidate 3 introduces screenshot-based visual phishing detection.

Together, they form a comprehensive multimodal foundation for the URL Phishing AI module within CyberShield-AI.

---

# Repository Status

| Document | Status |
|----------|--------|
| Candidate 1 Research | ✅ Completed |
| Candidate 2 Research | ✅ Completed |
| Candidate 3 Research | ✅ Completed |
| Dataset Comparison | ✅ Completed |
| Final Decision | ✅ Completed |

---

# Conclusion

The URL Phishing AI research successfully identifies and evaluates three complementary datasets covering structured URL analysis, webpage feature analysis, and visual phishing detection. Their combined use provides a robust foundation for developing an accurate, scalable, and explainable phishing detection system as part of the CyberShield-AI platform.