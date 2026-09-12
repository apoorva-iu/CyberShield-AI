# Dataset Analysis - Document Verification AI

## Objective

Evaluate multiple publicly available datasets for developing an AI-powered Document Verification module capable of extracting text, classifying documents, and detecting document forgery or tampering within CyberShield-AI.

---

# Candidate 1 – OCR Dataset of Multi-Type Documents

## Overview

The OCR Dataset of Multi-Type Documents is designed for Optical Character Recognition (OCR) and document understanding. It contains scanned images and bounding box annotations from multiple document categories, enabling accurate text extraction and document parsing.

### Dataset Characteristics

- Total Files: 8,531
- Categories: 4
- Data Type: Document Images + Bounding Box Annotations
- Target Task: OCR & Text Detection

### Document Categories

- DOCUMENT
- FORM
- INVOICE
- REAL_LIFE

### Strengths

- High-quality OCR annotations
- Multiple document categories
- Real-world document images
- Ready for OCR model training
- Well-organized train, validation, and test splits

### Weaknesses

- No document authenticity labels
- No forgery or tampering annotations
- Primarily designed for OCR

### Suitability

Highly suitable as the primary OCR dataset for extracting textual information from uploaded documents before further verification.

---

# Candidate 2 – RVL-CDIP Dataset

## Overview

The RVL-CDIP Dataset is a benchmark dataset for document image classification. It contains scanned document images from multiple document classes and is widely used for document understanding and intelligent document processing.

### Dataset Characteristics

- Document Classes: 16
- Data Type: Document Images
- Target Task: Document Classification

### Sample Document Classes

- Letter
- Form
- Email
- Invoice
- Resume
- Scientific Publication
- Budget
- Memo

### Strengths

- Industry-standard benchmark
- Multiple real-world document types
- Excellent for document classification
- Supports deep learning
- Widely used in research

### Weaknesses

- No OCR annotations
- No tampering labels
- Does not support forgery detection directly

### Suitability

Highly suitable for document classification and layout understanding before authenticity verification.

---

# Candidate 3 – DocTamper Dataset

## Overview

The DocTamper Dataset is a large-scale benchmark introduced in CVPR 2023 for detecting tampered text in document images. It provides pixel-level annotations for manipulated regions and supports document forgery detection research.

### Dataset Characteristics

- Total Images: 170,000
- Languages: English, Chinese
- Data Type: Document Images + Pixel-Level Masks
- Target Task: Document Tampering Detection

### Tampering Types

- Copy-Move
- Splicing
- Generated Text

### Strengths

- Large-scale benchmark
- Pixel-level annotations
- Multiple tampering techniques
- Designed specifically for document forgery detection
- Supports explainable AI

### Weaknesses

- Requires GPU for efficient training
- Computationally intensive
- Intended primarily for research

### Suitability

Highly suitable for detecting forged and manipulated documents, making it the core dataset for document authenticity verification.

---

# Overall Analysis

Each dataset contributes a unique capability required for an intelligent document verification system.

| Candidate   | Primary Capability         |
| ----------- | -------------------------- |
| Candidate 1 | OCR & Text Extraction      |
| Candidate 2 | Document Classification    |
| Candidate 3 | Document Forgery Detection |

Together, these datasets provide a complete pipeline for document verification, including OCR, document understanding, and authenticity verification.
