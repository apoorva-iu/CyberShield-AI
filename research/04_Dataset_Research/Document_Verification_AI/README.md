# Document Verification AI Research

## Module Overview

The **Document Verification AI** module is a core component of **CyberShield-AI**, designed to verify the authenticity of uploaded documents using Artificial Intelligence, Optical Character Recognition (OCR), Computer Vision, and Document Forensics.

This module aims to identify forged, tampered, or manipulated documents by combining OCR-based text extraction, document classification, and document tampering detection. Instead of relying on a single dataset, multiple benchmark datasets have been evaluated to build a comprehensive and robust document verification pipeline.

---

# Research Objectives

- Study publicly available document verification datasets.
- Compare multiple benchmark datasets.
- Evaluate datasets for OCR, document understanding, and forgery detection.
- Select the most suitable datasets for CyberShield-AI.
- Support Explainable AI and multimodal document verification.

---

# Research Methodology

The research was conducted through the following stages:

1. Dataset Collection
2. Literature Review
3. Dataset Analysis
4. Candidate Comparison
5. Final Dataset Selection
6. Integration Planning for CyberShield-AI

---

# Candidate Datasets

## Candidate 1

### OCR Dataset of Multi-Type Documents

- **Source:** Kaggle
- **Dataset Type:** Computer Vision + OCR Dataset
- **Files:** 8,531 Images and Annotations
- **Document Categories:**
  - DOCUMENT
  - FORM
  - INVOICE
  - REAL_LIFE

**Purpose**

Primary OCR dataset used for:

- Text Extraction
- Document Parsing
- Layout Analysis
- Information Extraction

**Status**

✅ Selected

---

## Candidate 2

### RVL-CDIP Dataset

- **Source:** Kaggle
- **Dataset Type:** Document Classification Dataset
- **Document Classes:** 16
- **Image Type:** Scanned Document Images

**Purpose**

Primary dataset for:

- Document Classification
- Document Layout Understanding
- Intelligent Document Processing

**Status**

✅ Selected

---

## Candidate 3

### DocTamper Dataset

- **Source:** Kaggle
- **Original Source:** CVPR 2023 Benchmark
- **Dataset Type:** Document Forgery Detection Dataset
- **Images:** 170,000

**Purpose**

Primary dataset for:

- Document Tampering Detection
- Forgery Detection
- Authenticity Verification
- Tampered Region Localization

**Status**

✅ Selected

---

# Research Files

```
Document_Verification_AI/
│
├── Candidate_1_OCR_Dataset/
│   ├── README.md
│   ├── notes.md
│   └── dataset_analysis.md
│
├── Candidate_2_RVL_CDIP/
│   ├── README.md
│   ├── notes.md
│   └── dataset_analysis.md
│
├── Candidate_3_DocTamper/
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

| Candidate   | Primary Capability           | Selected |
| ----------- | ---------------------------- | -------- |
| Candidate 1 | OCR & Text Extraction        | ✅       |
| Candidate 2 | Document Classification      | ✅       |
| Candidate 3 | Document Tampering Detection | ✅       |

---

# Why Multiple Datasets?

Each dataset contributes a different capability required for complete document verification.

### Candidate 1

Provides OCR capabilities by extracting textual information and document layouts from scanned documents.

### Candidate 2

Provides document classification and layout understanding, enabling the AI to recognize different document types before verification.

### Candidate 3

Provides document forgery detection by identifying manipulated text regions and detecting tampered documents.

Together, these datasets enable CyberShield-AI to perform comprehensive document verification instead of relying on a single OCR or classification model.

---

# Integration into CyberShield-AI

The selected datasets support the following workflow:

### Document Upload

User uploads an image or PDF.

↓

### OCR Processing

Extract textual content from the document.

↓

### Document Classification

Identify document type and understand its layout.

↓

### Tampering Detection

Detect edited or manipulated regions.

↓

### Explainable AI

Generate interpretable explanations highlighting detected anomalies and authenticity indicators.

↓

### Verification Report

Display verification status, confidence score, detected issues, and recommendations.

---

# Expected Outcomes

The selected datasets will enable CyberShield-AI to:

- Extract text from uploaded documents.
- Identify document types automatically.
- Detect forged and tampered documents.
- Support explainable AI.
- Improve document authentication accuracy.
- Assist users in verifying certificates, identity documents, invoices, and financial records.

---

# Technologies Planned

| Component               | Planned Technology                 |
| ----------------------- | ---------------------------------- |
| OCR                     | PaddleOCR / EasyOCR                |
| Document Classification | Vision Transformer (ViT), LayoutLM |
| Tampering Detection     | U-Net / SegFormer / DeepLabV3+     |
| Explainable AI          | SHAP / LIME                        |
| AI Explanation          | Gemini API                         |
| Backend                 | Flask                              |
| Frontend                | React                              |
| Database                | MongoDB                            |

---

# Final Decision

After evaluating multiple benchmark datasets, all three datasets have been selected because they provide complementary capabilities.

- **Candidate 1** provides OCR and text extraction.
- **Candidate 2** provides document classification and layout understanding.
- **Candidate 3** provides document forgery and tampering detection.

Together, these datasets establish a robust and explainable Document Verification AI pipeline for CyberShield-AI.

---

# Repository Status

| Document             | Status       |
| -------------------- | ------------ |
| Candidate 1 Research | ✅ Completed |
| Candidate 2 Research | ✅ Completed |
| Candidate 3 Research | ✅ Completed |
| Dataset Comparison   | ✅ Completed |
| Final Decision       | ✅ Completed |

---

# Conclusion

The Document Verification AI research successfully evaluates and selects three complementary datasets covering OCR, document classification, and forgery detection. Their combined use enables CyberShield-AI to build an intelligent, multimodal, and explainable document verification system capable of authenticating a wide variety of real-world documents.
