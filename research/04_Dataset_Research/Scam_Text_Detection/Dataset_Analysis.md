# Dataset Analysis

# Candidate 1 - Financial Scam and Deceptive Text Meta Dataset

## Overview

The Financial Scam and Deceptive Text Meta Dataset is a large-scale NLP dataset containing more than 62,000 text samples collected from multiple public datasets. It is designed for detecting deceptive, manipulative, and scam-related textual content.

---

## Dataset Characteristics

- Total Records: 62,258
- Features: 3
- Dataset Type: Text Classification
- Classification: Binary
- Target Column: label

---

## Features

### Text Feature

- text

### Metadata

- source

### Target

- label

---

## Strengths

- Large dataset
- Multi-source data collection
- Suitable for NLP
- Excellent for transformer-based models
- Supports Explainable AI
- High-quality binary labels

---

## Weaknesses

- Focused mainly on financial and deceptive language
- Does not identify individual scam categories
- No platform-specific metadata
- No images or attachments

---

## Suitability

This dataset is highly suitable for the Scam Communication AI module and serves as a strong foundational dataset for learning deceptive language patterns. Additional datasets covering emails, SMS, and social media scams can further improve the model's generalization.

# Candidate 2 - Phishing Email Dataset

## Overview

The Phishing Email Dataset is a comprehensive collection of real-world phishing and legitimate email messages compiled from multiple publicly available benchmark datasets. It is designed to support phishing email detection, email fraud analysis, and cybersecurity research using Natural Language Processing (NLP) and Machine Learning techniques.

---

## Dataset Characteristics

- Total Records: Approximately 82,500 Emails
- Number of Files: 7 CSV Files
- Merged Dataset: phishing_email.csv
- Number of Features: 36 (Merged Dataset)
- Dataset Type: Email Phishing Detection
- Classification Type: Binary
- Target Column: label

---

## Original Datasets Included

- CEAS 2008
- Enron
- Ling
- Nazario
- Nigerian Fraud
- SpamAssassin

---

## Common Features

### Email Metadata

- sender
- receiver
- date

### Email Content

- subject
- body

### URL Features

- urls

### Target

- label

---

## Data Modalities

- Email Text
- Email Metadata
- URLs
- Temporal Information

---

## Strengths

- Large-scale real-world dataset
- Combines multiple benchmark phishing datasets
- Rich email metadata
- Includes sender and receiver information
- Contains URLs for phishing link analysis
- Suitable for NLP and cybersecurity research
- Excellent for Explainable AI
- Supports phishing email detection and email fraud analysis

---

## Weaknesses

- Focused only on email-based communication
- Does not include WhatsApp, Telegram, or social media messages
- Different source datasets require preprocessing before merging
- Some features are dataset-specific and may contain missing values

---

## CyberShield-AI Relevance

This dataset is highly suitable for the **Scam Communication AI** module. It enables the system to detect phishing emails, credential theft attempts, fake invoices, malicious links, business email compromise (BEC), and other email-based social engineering attacks.

---

## Suitability

This dataset complements Candidate 1 by introducing email-specific features such as sender information, email subjects, message bodies, timestamps, and embedded URLs. It significantly enhances CyberShield-AI's ability to identify phishing campaigns and sophisticated email scams.

---

## Current Decision

**Selected as Candidate 2 for the Scam Communication AI module.**

# Candidate 3 - Scam and Non-Scam Call Conversation Dataset

## Overview

The Scam and Non-Scam Call Conversation Dataset is a conversation-based dataset developed for scam detection research. It focuses on identifying behavioral and linguistic patterns used by scammers during conversations rather than relying only on topic-specific keywords.

---

## Dataset Characteristics

- Total Conversations: 800
- Scam Conversations: 400
- Legitimate Conversations: 400
- Number of Files: 2
- Data Format: TXT
- Classification Type: Binary

---

## Data Sources

Conversation patterns originate from publicly available reports shared by victims across social media platforms, discussion forums, blogs, and other online communities. These conversations were anonymized and further augmented to improve diversity while preserving realistic scam behavior.

---

## Data Modalities

- Conversation Text
- Behavioral Patterns
- Social Engineering Techniques

---

## Strengths

- Based on real scam behavior
- Published in IEEE Access
- Balanced dataset
- Conversation-level analysis
- Suitable for NLP
- Excellent for Explainable AI

---

## Weaknesses

- Limited dataset size
- Focused on call conversations
- Requires preprocessing before training

---

## CyberShield-AI Relevance

This dataset strengthens the Scam Communication AI module by enabling behavioral analysis of scam conversations. It complements the other datasets by teaching the model to identify persuasion techniques, urgency, impersonation, and social engineering tactics commonly found in phone calls, messaging applications, and social media conversations.

---

## Current Decision

**Selected as Candidate 3 for the Scam Communication AI module.**
