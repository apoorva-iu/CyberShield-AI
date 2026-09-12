# Candidate 1 Research Notes

## Dataset Name

Phishing URL Websites Dataset (PhiUSIIL)

---

## Source

Kaggle

---

## Dataset Type

Structured Cybersecurity Dataset

---

## Objective

Evaluate the suitability of the PhiUSIIL dataset for detecting phishing websites within the CyberShield-AI platform.

---

## Dataset Overview

The PhiUSIIL dataset is a large-scale phishing detection dataset containing legitimate and phishing website records represented using engineered URL, domain, and webpage features. It has become one of the benchmark datasets for phishing detection research.

---

## Dataset Statistics

- Total Records: 235,795
- Legitimate Websites: 134,850
- Phishing Websites: 100,945
- Features: 54
- Target Column: label
- File Type: CSV

---

## Data Modalities

- URL Features
- Domain Features
- Structured Metadata
- Webpage Features

---

## Feature Categories

### URL Features

- URL Length
- Special Characters
- Number of Dots
- Hyphens
- HTTPS
- Digits
- Prefix/Suffix

### Domain Features

- Domain Characteristics
- Subdomains
- Top-Level Domain
- Domain Similarity

### Webpage Features

- Page Title
- Favicon
- Forms
- Images
- CSS
- JavaScript
- Social Links
- HTML Characteristics

---

## Machine Learning Suitability

Excellent

Supports:

- Binary Classification
- Feature Engineering
- Explainable AI
- Ensemble Learning
- Deep Learning
- Transformer Models

---

## Strengths

- Very large dataset
- Rich feature engineering
- Balanced classes
- High-quality benchmark dataset
- Excellent for phishing research
- Suitable for Explainable AI

---

## Weaknesses

- No website screenshots
- Requires preprocessing
- Limited webpage textual content

---

## Research Importance

The dataset is widely used for benchmarking phishing detection algorithms due to its comprehensive feature engineering and balanced representation of phishing and legitimate websites.

---

## CyberShield-AI Usage

This dataset will act as the primary training dataset for the URL Phishing AI module. The trained model will analyze suspicious URLs and determine the likelihood of phishing attacks before providing explainable predictions to users.

---

## Current Decision

✅ Selected as Candidate 1
