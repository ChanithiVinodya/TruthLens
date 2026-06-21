# 🧠 TruthLens – AI Hallucination Detection & Verification System

## 📌 Overview

TruthLens is an AI-powered system designed to detect, analyze, and verify hallucinations in AI-generated responses. It helps users identify unreliable or false information by combining claim extraction, fact verification, source credibility analysis, and confidence scoring.

The system enhances trust in AI by providing transparency, explanations, and user feedback mechanisms.

---
## User Interfaces
<img width="720" height="1471" alt="Screenshot_20260619_190528_TruthLens" src="https://github.com/user-attachments/assets/cd9655c9-836a-47d0-a805-541a575090af" />
<img width="480" height="1066" alt="1779435034943" src="https://github.com/user-attachments/assets/66b5dd45-8a88-4aa4-ab9b-04314836019a" />
<img width="720" height="1471" alt="Screenshot_20260619_190845_TruthLens" src="https://github.com/user-attachments/assets/a8a3b2a7-198e-4381-a76d-dd4c39a6702e" />
<img width="720" height="1471" alt="WhatsApp Image 2026-06-19 at 7 13 13 PM" src="https://github.com/user-attachments/assets/5ce56bfd-c8a3-4c77-9afd-b4f86ead61de" />
<img width="720" height="1471" alt="Screenshot_20260619_190858_TruthLens" src="https://github.com/user-attachments/assets/e6ce1ffd-5601-41b2-8b82-0ab5b1f19285" />
<img width="480" height="1066" alt="1779435037574" src="https://github.com/user-attachments/assets/5005f9a0-21d9-44c3-ab70-e66157665147" />
<img width="720" height="1471" alt="Screenshot_20260619_191045_TruthLens" src="https://github.com/user-attachments/assets/624890e3-a5b0-41f9-b624-5bc07a3bc846" />
<img width="720" height="1471" alt="Screenshot_20260619_190913_TruthLens" src="https://github.com/user-attachments/assets/f24817aa-b405-4178-ab7e-790db6178990" />
<img width="480" height="1066" alt="1779435035274" src="https://github.com/user-attachments/assets/487a596b-c395-454e-b6cc-17231e20869c" />


## 🌐 Live Deployment

🚀 **Backend API (Render):**
👉 https://ai-hallucination-detection-and.onrender.com

📱 **Mobile App:**
Built using React Native and connected to the deployed backend.

---

## 🚀 Features

### 🔍 AI Response Analysis

* Extracts key claims from AI-generated text
* Detects suspicious or hallucinated content
* Categorizes claims (factual, statistical, historical, general)

### ✅ Fact Verification Engine

* Verifies claims using external trusted sources
* Outputs:

  * Verified
  * Contradicted
  * Unverifiable

### 🌐 Source Credibility Evaluation

* Evaluates sources based on:

  * Authority
  * Recency
  * Trustworthiness

### 📊 Confidence & Hallucination Scoring

* Generates:

  * Confidence Score
  * Hallucination Risk Score

### 💡 Explanation & Transparency

* Shows why content was flagged
* Highlights risky sentences
* Improves user understanding

### 📝 Feedback System

* Users can rate and report outputs
* Helps improve system performance

---

## 🏗️ System Architecture

* **Frontend:** React Native
* **Backend:** Node.js + Express (Deployed on Render)
* **Database:** MongoDB Atlas
* **APIs:** External verification & AI APIs

---

## 📂 Project Structure

```
TruthLens/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── api-integrations/
│   └── database/
│
├── mobile-app/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   └── utils/
│   └── assets/
│
├── docs/
├── ui-design/
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔧 Backend (Local Development)

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run:

```bash
npm start
```

---

### 🌍 Using Deployed Backend (Render)

No need to run backend locally.
Just use:

```
https://ai-hallucination-detection-and.onrender.com
```

👉 Example:

```
GET /api/analyses
```

---

### 📱 Frontend (React Native)

```bash
cd mobile-app
npm install
npx expo start
```

⚠️ Make sure API base URL is set to your Render URL in your frontend config.

---

## 🔗 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Analysis

* `POST /api/analyses`
* `GET /api/analyses`
* `GET /api/analyses/:id`
* `PUT /api/analyses/:id`
* `DELETE /api/analyses/:id`

---

## 🧪 Testing

Use **Postman**:

* Base URL:

  ```
  https://ai-hallucination-detection-and.onrender.com
  ```
* Add JWT token for protected routes
* Test all CRUD operations

---

## 📊 Workflow

1. User submits AI-generated text
2. System extracts claims
3. Claims are verified
4. Source credibility is evaluated
5. Scores are generated
6. Explanation is displayed

---

## 🎯 Objectives

* Detect AI hallucinations
* Improve AI trustworthiness
* Provide explainable AI outputs
* Enable user feedback

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* React Native
* REST APIs
* NLP Techniques

---

## 👥 Contributors

* Gunarathna A.A.S.R
* Thevinya H.S.Y
* Jayasinghe J.A.D.T.N
* Bandara B.W.V.C.V
* Udumulla H.P
* Luke L.S

---

## ⭐ Future Improvements

* Real-time verification
* More trusted data sources
* Advanced AI models
* Web dashboard

---

## 📜 License

This project is for academic purposes.


