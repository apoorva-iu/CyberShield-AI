
# Final Dataset Selection - URL Phishing AI

## Objective

Select the most suitable dataset(s) for developing the **URL Phishing AI** module of **CyberShield-AI** after evaluating multiple candidate datasets based on dataset quality, feature richness, research relevance, explainability, scalability, and real-world applicability.

---

# Evaluated Datasets

| Candidate | Dataset | Status |
|-----------|---------|--------|
| Candidate 1 | PhiUSIIL Phishing URL Dataset | ✅ Selected |
| Candidate 2 | Web Page Phishing Detection Dataset | ✅ Selected |
| Candidate 3 | Phishing Sites Screenshot Dataset | ✅ Selected |

---

# Evaluation Criteria

The datasets were evaluated using the following criteria:

- Dataset quality and reliability
- Number of records
- Feature richness
- Data modality
- Research popularity
- Explainability support
- Deep Learning compatibility
- Computer Vision support
- Real-world applicability
- Integration with CyberShield-AI

---

# Final Selection

Unlike traditional approaches that rely on a single dataset, **CyberShield-AI adopts a multimodal approach**. Therefore, all three datasets are selected because each contributes unique capabilities that enhance phishing detection performance.

---

## Candidate 1 – PhiUSIIL Phishing URL Dataset

### Role

Primary dataset for phishing URL detection.

### Reason for Selection

- Large-scale benchmark dataset with **235,795** records.
- Rich URL, domain, and webpage features.
- Excellent support for Machine Learning, Deep Learning, and Explainable AI.
- Well-balanced and widely used in phishing detection research.
- Ideal for learning phishing patterns from structured website characteristics.

### Contribution

- URL analysis
- Domain analysis
- Feature-based phishing detection
- Primary model training

---

## Candidate 2 – Web Page Phishing Detection Dataset

### Role

Secondary dataset for webpage feature analysis.

### Reason for Selection

- Provides detailed HTML and webpage characteristics.
- Complements Candidate 1 by introducing webpage-level information.
- Improves feature diversity and model generalization.
- Strengthens Explainable AI by incorporating additional webpage indicators.

### Contribution

- HTML analysis
- Webpage feature analysis
- Feature engineering
- Secondary model enhancement

---

## Candidate 3 – Phishing Sites Screenshot Dataset

### Role

Computer Vision dataset for visual phishing detection.

### Reason for Selection

- Enables screenshot-based phishing detection.
- Supports deep learning models such as CNNs and Vision Transformers.
- Allows CyberShield-AI to analyze website screenshots uploaded by users.
- Complements structured datasets with visual information.

### Contribution

- Screenshot analysis
- Visual phishing detection
- OCR integration
- Computer Vision capabilities

---

# Why Multiple Datasets?

Each dataset captures a different aspect of phishing detection.

| Dataset | Specialization |
|----------|----------------|
| Candidate 1 | URL and domain analysis |
| Candidate 2 | HTML and webpage feature analysis |
| Candidate 3 | Visual screenshot analysis |

Combining these datasets enables CyberShield-AI to detect phishing websites using multiple perspectives instead of relying on a single source of information.

---

# Integration into CyberShield-AI

The selected datasets will support the following workflow:

1. **URL Analysis**
   - Detect suspicious URL patterns using Candidate 1.

2. **Webpage Analysis**
   - Evaluate webpage structure and HTML features using Candidate 2.

3. **Screenshot Analysis**
   - Analyze uploaded website screenshots using Candidate 3.

4. **Explainable AI**
   - Generate interpretable explanations for predictions.

5. **User Feedback**
   - Present phishing probability, detected risk indicators, and recommendations through the CyberShield-AI interface.

---

# Expected Benefits

- Improved phishing detection accuracy.
- Better generalization across different phishing techniques.
- Support for multimodal phishing detection.
- Enhanced Explainable AI capabilities.
- Greater robustness for real-world cybersecurity applications.

---

# Final Decision

After comprehensive evaluation, **all three datasets have been selected** for the URL Phishing AI module.

Rather than replacing one another, these datasets complement each other by providing structured URL analysis, webpage feature analysis, and visual screenshot analysis. This multimodal strategy aligns with the overall architecture of CyberShield-AI and is expected to deliver more accurate, explainable, and reliable phishing detection in real-world scenarios.

---

## Selection Summary

| Candidate | Role | Status |
|-----------|------|--------|
| Candidate 1 – PhiUSIIL | Primary URL Detection | ✅ Selected |
| Candidate 2 – Web Page Phishing Detection | Secondary Webpage Analysis | ✅ Selected |
| Candidate 3 – Phishing Sites Screenshot | Visual Phishing Detection | ✅ Selected |

---

## Conclusion

The combination of these three datasets provides a comprehensive foundation for building a robust, scalable, and explainable **URL Phishing AI** module. Their complementary strengths enable CyberShield-AI to detect phishing attacks through URL characteristics, webpage structure, and visual website appearance, making the system better suited for real-world cybersecurity challenges.