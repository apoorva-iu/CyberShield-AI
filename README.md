# CyberShield AI

An end-to-end machine learning platform that detects online fraud: **fake job/internship postings**, **phishing URLs** and **scam messages**. Every scan result is stored in a tamper-evident, hash-chained ledger.

## Features

- **Phishing URL detection**: classifies URLs using engineered URL-based features.
- **Fake job / internship detection**: analyses posting text using TF-IDF and machine learning.
- **Scam message detection**: flags suspicious messages.
- **Risk score and verdict**: each scan returns a risk score, threat level and verdict.
- **Tamper-evident ledger**: scan results are stored in MongoDB in a SHA-256 hash-chained ledger, where each block stores the previous block's hash, so any change to old records is detectable.
- **Dashboard**: React frontend connected to a Flask REST API.
- **In development**: a desktop agent (floating dock) that scans user-selected content and returns risk scores from the same models.

## Tech Stack

| Area | Tools |
|---|---|
| Language | Python |
| Machine learning | Scikit-learn, Pandas, NumPy, TF-IDF |
| Models | Logistic Regression, Random Forest, Linear SVM |
| Backend | Flask (REST API) |
| Frontend | React.js |
| Database | MongoDB |

## Project Structure

```
CyberShield-AI/
├── ai_models/   # trained models, notebooks and evaluation
├── backend/     # Flask REST API and MongoDB ledger
├── frontend/    # React dashboard
├── research/    # dataset and model research
└── Project_Roadmap.md
```

## Methodology

1. Data cleaning and preprocessing, including removal of duplicates and data leakage
2. Feature engineering (TF-IDF for text, lexical features for URLs)
3. Handling class imbalance
4. Training and comparing multiple classifiers
5. Evaluation using Precision, Recall, F1-score, PR-AUC and confusion matrices

## Results

| Module | Accuracy |
|---|---|
| Phishing URL detection | 99.4% |
| Fake job detection | ~84% |

> Fake job data is imbalanced, so Precision, Recall, F1 and PR-AUC were used alongside accuracy.

## Run Locally

> Update these commands to match your repo.

```bash
# clone
git clone https://github.com/apoorva-iu/CyberShield-AI.git
cd CyberShield-AI

# backend
pip install -r requirements.txt
python app.py

# frontend
cd frontend
npm install
npm start
```

Create a `.env` file with your own MongoDB connection string (never commit it):

```
MONGO_URI=your_mongodb_connection_string
```

## Author

**Apoorva I U**: [LinkedIn](https://www.linkedin.com/in/apoorva-i-u-97059034b) | [GitHub](https://github.com/apoorva-iu)

## License

MIT License
