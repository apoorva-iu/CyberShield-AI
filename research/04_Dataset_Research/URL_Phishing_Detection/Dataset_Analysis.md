# Dataset Analysis

# Dataset Analysis - Candidate 1 (PhiUSIIL)

## Overview

The PhiUSIIL (Phishing URL Websites Dataset) is a comprehensive cybersecurity dataset developed for phishing website detection. It contains structured information extracted from legitimate and phishing websites, enabling AI models to learn phishing patterns using URL, domain, and webpage characteristics.

---

## Dataset Characteristics

- Total Records: 235,795
- Legitimate Websites: 134,850
- Phishing Websites: 100,945
- Number of Features: 54
- Target Column: label

---

## Data Types

### URL Features

Examples include:

- URL Length
- Number of Dots
- Hyphens
- Digits
- HTTPS Usage
- Special Characters
- Prefix/Suffix
- URL Similarity

---

### Domain Features

Examples include:

- Domain Length
- Subdomain Count
- Domain Similarity
- Top-Level Domain
- Domain Characteristics

---

### Webpage Features

Examples include:

- Page Title
- URL-Title Matching
- Favicon
- HTML Components
- Images
- CSS Files
- JavaScript Files
- Forms
- Social Media Links
- Responsive Design Indicators

---

### Target

- label

0 → Phishing Website

1 → Legitimate Website

---

## Strengths

- Large-scale dataset
- Rich engineered cybersecurity features
- High-quality benchmark dataset
- Supports Explainable AI
- Suitable for Traditional ML
- Suitable for Deep Learning
- Well-balanced dataset

---

## Weaknesses

- No visual website screenshots
- No OCR-compatible content
- Requires feature preprocessing

---

## AI Suitability

| AI Technique          | Suitability |
| --------------------- | ----------- |
| Machine Learning      | ⭐⭐⭐⭐⭐  |
| Deep Learning         | ⭐⭐⭐⭐⭐  |
| Explainable AI        | ⭐⭐⭐⭐⭐  |
| Production Deployment | ⭐⭐⭐⭐⭐  |

---

## CyberShield-AI Integration

Within CyberShield-AI, this dataset will serve as the primary dataset for the URL Phishing AI module. The trained model will analyze URL structures and webpage characteristics to detect phishing websites. The prediction results will be combined with the Explainable AI engine and Gemini API to generate user-friendly security explanations and recommendations.

---

## Overall Evaluation

Overall Rating: ⭐⭐⭐⭐⭐ (10/10)

Recommendation: **Selected as Candidate 1**

# Dataset Analysis - Candidate 2 (Web Page Phishing Detection)

## Overview

The Web Page Phishing Detection Dataset contains engineered URL, webpage, HTML, and external service features extracted from phishing and legitimate websites. It provides a comprehensive benchmark for phishing detection using structured machine learning features.

---

## Dataset Characteristics

- Total Records: 11,430
- Features: 87
- Balanced Classes
- Target: Result

---

## Data Types

### URL Features

- URL Structure
- URL Length
- HTTPS
- Special Characters

### HTML Features

- Forms
- Scripts
- CSS
- JavaScript
- iFrames

### External Features

- WHOIS
- Domain Information
- External Security Indicators

---

## Strengths

- Rich webpage information
- Excellent feature engineering
- Balanced dataset
- Suitable for Explainable AI

---

## Weaknesses

- No visual webpage screenshots
- Requires preprocessing

---

## Suitability

This dataset complements Candidate 1 by providing webpage-level phishing indicators, allowing CyberShield-AI to improve phishing detection accuracy.

---

## Overall Evaluation

⭐⭐⭐⭐☆ (9.5/10)

Recommendation: Selected as Candidate 2.

# Dataset Analysis - Candidate 3 (Phishing Sites Screenshot)

## Overview

The Phishing Sites Screenshot Dataset is a computer vision dataset consisting of screenshots of phishing and legitimate websites. It is designed for image classification models that detect phishing websites using visual appearance rather than textual or structural features.

---

## Dataset Characteristics

- Dataset Type: Image Classification
- Categories: 2
- Image Format: PNG

---

## Data Types

### Image Features

- Website Layout
- Login Pages
- Brand Logos
- UI Components
- Visual Design

### Target Classes

- genuine_site_0
- phishing_site_1

---

## Strengths

- Supports multimodal AI
- Enables visual phishing detection
- Suitable for CNN and Vision Transformers
- Useful for OCR integration

---

## Weaknesses

- No URL information
- No structured metadata
- Requires image preprocessing

---

## Suitability

This dataset adds computer vision capabilities to CyberShield-AI, allowing phishing detection from uploaded website screenshots and complementing the structured URL datasets.

---

## Overall Evaluation

⭐⭐⭐⭐⭐ (10/10)

Recommendation: Selected as Candidate 3.
