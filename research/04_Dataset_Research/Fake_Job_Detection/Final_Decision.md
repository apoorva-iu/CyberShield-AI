# Final Decision

## Evaluation Summary

Three candidate datasets were evaluated for the Fake Job Detection module.

### Candidate 1

Recruitment Scam (EMSCAD)

- Original benchmark dataset
- Real-world data
- Excellent for NLP

---

### Candidate 2

Multimodal Real/Fake Job Posting Prediction

- Based on EMSCAD
- Includes company website screenshots
- Supports multimodal AI
- Best choice for future scalability

---

### Candidate 3

Fake vs Real Job Postings (Synthetic NLP Dataset)

- Synthetic dataset
- Rich engineered features
- Suitable for robustness testing
- Useful for external validation

---

## Final Selection Strategy

Primary Training Dataset

✅ Candidate 2

External Validation

✅ Candidate 1

Cross-Dataset Robustness Testing

✅ Candidate 3

---

## Justification

Candidate 2 provides the richest feature set by combining textual information, structured metadata, and visual website screenshots, making it the most suitable dataset for building the primary fake job detection model.

Candidate 1 will be used to validate the model on the original benchmark dataset.

Candidate 3 will be used as an external evaluation dataset to measure the model's generalization capability on synthetic job postings.

This strategy ensures that CyberShield AI is trained on high-quality real-world data while also demonstrating robustness across different dataset distributions.
