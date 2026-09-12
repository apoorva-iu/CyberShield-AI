# Dataset Analysis

## Overview

Three candidate datasets were selected and analyzed for developing the Fake Job Detection module of **CyberShield-AI**. The evaluation focuses on dataset quality, feature richness, data modalities, research relevance, computational requirements, and suitability for building an explainable AI-based fraud detection system.

---

# Candidate 1 – Recruitment Scam (EMSCAD)

## Overview

The Recruitment Scam (EMSCAD) dataset is one of the most widely used benchmark datasets for fake job detection research. It contains real-world job advertisements collected from multiple online recruitment platforms and has become the standard dataset used in many research papers.

### Dataset Characteristics

- Dataset Type: Real-world
- Total Records: 17,880
- Legitimate Jobs: 17,014
- Fraudulent Jobs: 866
- Number of Features: 18
- Target Column: `fraudulent`

### Data Modalities

#### Text Features

- title
- company_profile
- description
- requirements
- benefits

#### Structured Metadata

- employment_type
- required_experience
- required_education
- industry
- function
- department
- location
- salary_range

#### Binary Features

- telecommuting
- has_company_logo
- has_questions

#### Target

- fraudulent

### Strengths

- Real-world recruitment data
- Benchmark dataset used in research
- Rich textual information
- Structured metadata
- Suitable for NLP
- Supports Explainable AI

### Limitations

- Highly imbalanced dataset
- Missing values
- Older recruitment data (2012–2014)
- No visual information

### Suitability

Excellent benchmark dataset for fake job detection and external validation.

---

# Candidate 2 – Multimodal Real/Fake Job Posting Prediction

## Overview

Candidate 2 extends the original EMSCAD dataset by incorporating company website screenshots along with textual and structured information. This enables multimodal fraud detection using Natural Language Processing and Computer Vision.

### Dataset Characteristics

- Dataset Type: Real-world Multimodal Dataset
- Total Records: Approximately 18,000
- Structured Features: 18
- Additional Data: Company Website Screenshots
- Target Column: `fraudulent`

### Data Modalities

#### Text Features

- title
- company_profile
- description
- requirements
- benefits

#### Structured Metadata

- employment_type
- required_experience
- required_education
- industry
- function
- department
- location
- salary_range

#### Visual Features

- Company Homepage Screenshot
- Website Appearance
- Layout
- Visual Trust Indicators

#### Binary Features

- telecommuting
- has_company_logo
- has_questions

#### Target

- fraudulent

### Strengths

- Based on the trusted EMSCAD benchmark
- Supports multimodal AI
- Rich textual information
- Structured metadata
- Website screenshots enable Computer Vision
- Future-ready for OCR integration
- Supports advanced Explainable AI

### Limitations

- Large storage requirement
- Higher computational cost
- Image preprocessing required
- More complex model architecture

### Suitability

Highly suitable as the **primary training dataset** for CyberShield-AI due to its multimodal capabilities and future scalability.

---

# Candidate 3 – Fake vs Real Job Postings (Synthetic NLP Dataset)

## Overview

Candidate 3 is a synthetic dataset specifically designed for Natural Language Processing (NLP) and fake job posting detection research. Unlike the EMSCAD datasets, it contains several engineered features that simulate real-world recruitment scenarios and provide additional contextual information for machine learning experiments.

### Dataset Characteristics

- Dataset Type: Synthetic
- Total Records: 3,000
- Classification: Binary
- Target Column: `is_fake`

---

## Data Modalities

### Text Features

- job_title
- job_description
- requirements
- benefits
- company_profile
- fraud_reason

### Company Information

- company_name
- company_website
- contact_email
- has_logo

### Job Metadata

- industry
- employment_type
- location
- department
- job_function
- salary_range
- required_experience_years
- education_level
- telecommuting
- num_open_positions

### Time-Based Features

- posting_date
- application_deadline

### Engineered Features

- text_length

### Unique Identifier

- job_id

### Target

- is_fake

---

## Strengths

- Rich engineered features
- Includes recruiter contact information
- Contains company website details
- Includes fraud_reason for explainability research
- Balanced synthetic dataset
- Easy preprocessing
- Suitable for NLP classification
- Supports Explainable AI
- Useful for robustness testing

---

## Limitations

- Synthetic rather than real-world
- Artificially generated recruitment patterns
- May not capture all real-world scam behaviors
- Smaller than the EMSCAD datasets

---

## Suitability

Candidate 3 is recommended as an **external evaluation dataset**. It provides additional engineered features such as **fraud_reason**, **contact_email**, **company_website**, and **text_length**, making it valuable for testing the robustness and explainability of the CyberShield-AI fake job detection model.
