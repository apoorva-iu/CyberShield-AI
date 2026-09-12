# Fake Job Dataset Comparison

## Objective

Compare multiple fake job datasets and identify the most suitable dataset for developing the **Fake Job Detection** module of **CyberShield-AI**. The comparison is based on data quality, feature richness, explainability, research relevance, scalability, computational requirements, and future extensibility.

## Objective

Compare multiple fake job datasets and select the most suitable dataset for CyberShield-AI.

| Criteria                    | Candidate 1                       | Candidate 2                                             | Candidate 3                                       |
| --------------------------- | --------------------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| Dataset                     | Recruitment Scam (EMSCAD)         | Multimodal Real/Fake Job Posting Prediction             | Fake vs Real Job Postings (Synthetic NLP Dataset) |
| Source                      | Kaggle                            | Kaggle                                                  | Kaggle                                            |
| Kaggle Owner                | Amruth Jith Raj V R               | Nithin1729S                                             | Khushi Yadav                                      |
| Original Source             | University of the Aegean (EMSCAD) | University of the Aegean (EMSCAD) + Website Screenshots | Synthetic NLP Dataset                             |
| Dataset Type                | Real-world                        | Real-world Multimodal                                   | Synthetic                                         |
| Records                     | 17,880                            | ~17,880                                                 | 3,000                                             |
| Target Column               | `fraudulent`                      | `fraudulent`                                            | `is_fake`                                         |
| Structured Features         | 18                                | 18                                                      | 26                                                |
| Additional Data             | None                              | Company Website Screenshots                             | Fraud Reason, Contact Email, Company Website      |
| Data Modalities             | Text + Structured Metadata        | Text + Structured Metadata + Images                     | Text + Structured Metadata                        |
| File Type                   | CSV                               | CSV + PNG Images                                        | CSV                                               |
| Dataset Size                | 59.07 MB                          | ~1.2 GB _(Verify after download)_                       | ~1 MB _(Verify after download)_                   |
| License                     | CC0                               | MIT                                                     | MIT                                               |
| Real World Dataset          | ✅ Yes                            | ✅ Yes                                                  | ❌ No (Synthetic)                                 |
| NLP Ready                   | ✅ Yes                            | ✅ Yes                                                  | ✅ Yes                                            |
| Computer Vision Ready       | ❌ No                             | ✅ Yes                                                  | ❌ No                                             |
| Explainability Support      | Excellent                         | Excellent                                               | Excellent _(Fraud Reason Available)_              |
| Multimodal AI Support       | ❌ No                             | ✅ Yes                                                  | ❌ No                                             |
| Fraud Reason Available      | ❌ No                             | ❌ No                                                   | ✅ Yes                                            |
| Company Website Available   | Limited                           | Website Screenshots                                     | Company Website URL                               |
| Contact Email Available     | ❌ No                             | ❌ No                                                   | ✅ Yes                                            |
| Research Usage              | Excellent                         | Excellent                                               | Good                                              |
| Computational Complexity    | Medium                            | High                                                    | Low                                               |
| Primary Purpose             | Benchmark Dataset                 | Primary Training Dataset                                | External Evaluation & Explainability              |
| Suitable for CyberShield-AI | ⭐⭐⭐⭐☆                         | ⭐⭐⭐⭐⭐                                              | ⭐⭐⭐⭐☆                                         |
| Overall Rating              | **9.5 / 10**                      | **10 / 10**                                             | **8.8 / 10**                                      |

# Initial Observations

## Candidate 1 – Recruitment Scam (EMSCAD)

### Strengths

- Original benchmark dataset used extensively in fake job detection research.
- Contains real-world recruitment advertisements.
- Rich textual and structured metadata.
- Well suited for Natural Language Processing (NLP).
- Easier to preprocess and train.
- Excellent benchmark for comparing model performance with published research.

### Limitations

- Highly imbalanced dataset.
- Older data collected between 2012 and 2014.
- Does not contain visual information.
- No fraud explanation labels.

---

## Candidate 2 – Multimodal Real/Fake Job Posting Prediction

### Strengths

- Enhanced version of the EMSCAD dataset.
- Includes company website screenshots.
- Supports multimodal AI using text, metadata, and images.
- Suitable for future OCR and Computer Vision integration.
- Rich dataset for building scalable AI systems.
- Best suited for production-quality fake job detection.

### Limitations

- Large storage requirements.
- Higher computational cost.
- Requires image preprocessing.
- Longer model training time.

---

## Candidate 3 – Fake vs Real Job Postings (Synthetic NLP Dataset)

### Strengths

- Rich engineered metadata.
- Includes recruiter contact email.
- Includes company website information.
- Contains **fraud_reason**, enabling explainable AI.
- Clean and balanced dataset.
- Useful for robustness testing and feature engineering.
- Easy to preprocess.

### Limitations

- Synthetic dataset rather than real-world data.
- Smaller dataset compared to EMSCAD.
- Artificial language patterns may differ from real recruitment scams.
- Less commonly used in academic research.

---

# Comparative Summary

| Evaluation Aspect          | Best Candidate            |
| -------------------------- | ------------------------- |
| Real-world Data            | Candidate 1 & Candidate 2 |
| Richest Feature Set        | Candidate 3               |
| Computer Vision Support    | Candidate 2               |
| Explainable AI             | Candidate 3               |
| Benchmark Research Dataset | Candidate 1               |
| Future Scalability         | Candidate 2               |
| Production Readiness       | Candidate 2               |

---

# Final Decision

After evaluating all three datasets, the following strategy has been selected for the CyberShield-AI project.

## Primary Training Dataset

**✅ Candidate 2 – Multimodal Real/Fake Job Posting Prediction**

**Reason**

- Combines textual information, structured metadata, and website screenshots.
- Supports multimodal learning.
- Provides the strongest foundation for future AI enhancements.

---

## Benchmark Validation Dataset

**✅ Candidate 1 – Recruitment Scam (EMSCAD)**

**Reason**

- Industry-standard benchmark dataset.
- Enables comparison with published research.
- Validates the model using real-world recruitment scams.

---

## External Evaluation Dataset

**✅ Candidate 3 – Fake vs Real Job Postings (Synthetic NLP Dataset)**

**Reason**

- Tests model robustness on unseen data.
- Evaluates generalization capability.
- Provides fraud reasons for explainable AI research.

---

# Conclusion

CyberShield-AI will adopt a **multi-dataset evaluation strategy** rather than relying on a single dataset.

- **Candidate 2** will be used for model training.
- **Candidate 1** will be used for benchmark validation.
- **Candidate 3** will be used for external testing and explainability evaluation.

This strategy ensures that the proposed fake job detection system is **accurate, robust, explainable, and scalable**, while also following a sound research methodology suitable for a final-year AI and cybersecurity project.
