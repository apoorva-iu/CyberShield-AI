# Candidate 1 Research Notes

## Dataset Name

OCR Dataset of Multi-Type Documents

---

## Source

Kaggle

---

## Dataset Author

Senju14

---

## License

MIT License

---

## Dataset Type

Computer Vision Dataset

---

## Modalities

- Document Images
- Bounding Box Annotations

---

## Purpose

Designed for Optical Character Recognition (OCR), document understanding, and information extraction across multiple document types.

---

## Document Categories

- DOCUMENT
- FORM
- INVOICE
- REAL_LIFE

---

## Dataset Split

### DOCUMENT

- Train: 1,231
- Validation: 155
- Test: 153

### FORM

- Train: 159
- Validation: 19
- Test: 21

### INVOICE

- Train: 778
- Validation: 97
- Test: 98

### REAL_LIFE

- Train: 1,244
- Validation: 156
- Test: 155

---

## Total Dataset

- Total Files: 8,531
- Images
- Annotation Files

---

## Annotation Type

Bounding Box Annotations

---

## Supported Tasks

- OCR
- Text Detection
- Document Parsing
- Layout Analysis
- Information Extraction

---

## Suitable Models

- PaddleOCR
- EasyOCR
- Tesseract OCR
- TrOCR
- LayoutLM
- Donut

---

## Real-World Applications

- Document Digitization
- Identity Verification
- Invoice Processing
- Financial Record Analysis
- Form Processing
- Intelligent Document Processing

---

## Strengths

- Multiple document categories
- Real-world document images
- High-quality annotations
- Ready for OCR model training
- Well-organized train/validation/test splits

---

## Weaknesses

- No forged document samples
- No tampering labels
- Focused only on OCR and document understanding

---

## Why Selected for CyberShield-AI

This dataset has been selected as the primary OCR dataset for the Document Verification AI module because it provides diverse document images with detailed annotations. It forms the first stage of the verification pipeline by extracting textual information from uploaded documents before document classification and tampering detection are performed using the subsequent datasets.
