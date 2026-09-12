# OCR Dataset of Multi-Type Documents

## Overview

The OCR Dataset of Multi-Type Documents is a comprehensive document image dataset developed for Optical Character Recognition (OCR) and document understanding research. It contains scanned document images and corresponding bounding box annotations from multiple document categories, enabling the development, training, and evaluation of OCR systems in real-world scenarios.

The dataset includes both structured and unstructured documents such as invoices, forms, identity cards, and real-life document photographs, making it suitable for intelligent document processing applications.

---

## Source

- **Platform:** Kaggle
- **Dataset Name:** OCR Dataset of Multi-Type Documents
- **Dataset Author:** Senju14
- **License:** MIT License

---

## Purpose

This dataset is designed to support research and development in:

- Optical Character Recognition (OCR)
- Text Detection
- Document Understanding
- Document Layout Analysis
- Information Extraction
- Intelligent Document Processing

---

## Dataset Categories

The dataset consists of four document categories:

- DOCUMENT
- FORM
- INVOICE
- REAL_LIFE

Each category is divided into:

- Training Set
- Validation Set
- Test Set

---

## Dataset Statistics

### DOCUMENT

| Split      | Images | Annotations |
| ---------- | ------ | ----------- |
| Train      | 1,231  | 1,231       |
| Validation | 155    | 155         |
| Test       | 153    | 153         |

### FORM

| Split      | Images | Annotations |
| ---------- | ------ | ----------- |
| Train      | 159    | 159         |
| Validation | 19     | 19          |
| Test       | 21     | 21          |

### INVOICE

| Split      | Images | Annotations |
| ---------- | ------ | ----------- |
| Train      | 778    | 778         |
| Validation | 97     | 97          |
| Test       | 98     | 98          |

### REAL_LIFE

| Split      | Images | Annotations |
| ---------- | ------ | ----------- |
| Train      | 1,244  | 1,243       |
| Validation | 156    | 156         |
| Test       | 155    | 155         |

---

## Dataset Features

- Multiple document categories
- Structured and unstructured documents
- Bounding box annotations
- OCR-ready dataset
- Real-life document images
- Train, validation, and test splits
- Total of **8,531 files** (images and annotations)

---

## Applications

This dataset can be used for:

- OCR model development
- Document digitization
- Identity verification
- Invoice processing
- Form recognition
- Financial document analysis
- Intelligent document processing
- Document information extraction

---

## Suitable Models

- PaddleOCR
- EasyOCR
- Tesseract OCR
- TrOCR
- LayoutLM
- Donut
- Vision Transformer (ViT)

---

## Role in CyberShield-AI

This dataset is selected as **Candidate 1** for the **Document Verification AI** module.

Within CyberShield-AI, it will be used for:

- Extracting text from uploaded documents
- Detecting document layout
- Processing invoices and forms
- Supporting identity document analysis
- Providing OCR results for downstream document verification

---

## Advantages

- Diverse document categories
- High-quality bounding box annotations
- OCR-ready
- Real-world document images
- Suitable for deep learning
- Supports multiple OCR frameworks

---

## Limitations

- Focused primarily on OCR
- Does not contain forged or tampered documents
- No document authenticity labels

---

## Conclusion

The OCR Dataset of Multi-Type Documents provides a robust foundation for OCR and document understanding tasks. Its diverse document categories and detailed annotations make it an excellent choice for developing document processing pipelines and serves as the primary OCR dataset for the Document Verification AI module in CyberShield-AI.
