# Candidate 1 Research Notes

## Objective

Evaluate the Financial Scam and Deceptive Text Meta Dataset for the Scam Communication AI module.

---

## Dataset Summary

This dataset combines deceptive and authentic textual content from multiple public datasets. It is intended for training NLP models to identify financial scams, manipulative messages, and deceptive communication.

---

## Dataset Statistics

- Total Records: 62,258
- Number of Features: 3
- Dataset Type: Text Classification
- Classification Type: Binary

---

## Columns

### text

Raw textual content containing financial statements, social media posts, headlines, or scam-related messages.

### label

Target variable.

- 0 → Authentic / Neutral / Factual
- 1 → Manipulative / Deceptive / Scam

### source

Indicates the original dataset from which the text sample was collected.

---

## Strengths

- Large dataset
- Multi-source collection
- Excellent for NLP
- Useful for Explainable AI
- Suitable for transformer models
- Good diversity of deceptive language

---

## Limitations

- Primarily focused on financial and deceptive text
- Does not explicitly separate scam categories (OTP, Romance, Banking, etc.)
- No platform information (SMS, WhatsApp, Email, Telegram)
- No multimedia content

---

## Suitability for CyberShield-AI

This dataset is highly suitable as a foundational dataset for the Scam Communication AI module. It provides a large collection of deceptive textual patterns that can be combined with other datasets to improve detection across multiple communication platforms.

---

## Current Decision

Selected as Candidate 1.
