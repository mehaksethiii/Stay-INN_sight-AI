# INN Sight AI — Hotel Review Intelligence Platform

Deployed Link = https://stay-inn-sight-ai-f3ov.vercel.app/

<img width="939" height="489" alt="Screenshot 2026-08-08 101510" src="https://github.com/user-attachments/assets/47e4eedd-d2bc-4689-8acc-0b65b7818f06" />

<img width="941" height="482" alt="Screenshot 2026-08-08 101620" src="https://github.com/user-attachments/assets/b4332046-fefa-495d-8a9e-a91b8bdbf074" />

<img width="643" height="499" alt="Screenshot 2026-08-08 102123" src="https://github.com/user-attachments/assets/fe1401f8-7941-4372-82fc-2a86e51da010" />

<img width="934" height="503" alt="Screenshot 2026-08-08 102145" src="https://github.com/user-attachments/assets/429ec587-9efd-4f9b-a9dd-c88b1d8bfdb8" />



> **Intern ID**: TBI-26101076 | **Week 9 — App Deployment & Go-Live**

A full-stack AI-powered hotel review management platform built with React, Node.js, Express, and MongoDB. Features real-time AI sentiment analysis, dual-engine review intelligence, and a domain-specific AI chatbot.

---

## 🤖 AI Features (Week 7)

### 1. AI Review Analyser (`/ai-analyser`)
- User inputs a hotel guest review
- Backend calls **Groq LLaMA 3.1** for deep analysis
- Returns: sentiment, emotion, detected themes, key issues, recommendations, business insight, and AI-generated management response
- **Endpoint**: `POST /api/ai/analyse`

### 2. Floating AI Chatbot
- Domain-specific chatbot powered by **Groq LLaMA 3.1**
- Knows about INN Sight AI's features, dashboard, reviews, and AI analysis
- Supports markdown rendering, typing indicator, conversation history, minimize/maximize/close
- **Endpoint**: `POST /api/ai/chat`

### 3. AI Sentiment on Review Submission
- Every new review is automatically classified by AI (Groq → HuggingFace → Local NLP fallback)
- Sentiment stored in MongoDB and displayed in Dashboard
- **Endpoint**: `POST /api/reviews`

---

## 🏗️ Architecture

```
Frontend (React)
    ↓
Backend (Express)
    ↓
AI Engine Chain:
  1. Groq LLaMA 3.1       ← Primary (fast, works locally)
  2. HuggingFace RoBERTa  ← Secondary (production/Render)
  3. Local NLP            ← Fallback (always works offline)
    ↓
MongoDB Atlas
```

---

## 📁 Project Structure

```
├── backend/
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ai.js          ← AI endpoints
│   │   └── auth.js
│   ├── services/          ← Week 7 AI Services
│   │   ├── groq.service.js
│   │   ├── huggingface.service.js
│   │   ├── sentiment.service.js
│   │   ├── analysis.service.js
│   │   └── chatbot.service.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/
│   │   ├── FloatingChatbot.js   ← Week 7
│   │   ├── Navbar.js
│   │   └── ...
│   ├── pages/
│   │   ├── AIAnalyser.js        ← Week 7
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Profile.js
│   └── App.js
├── PROMPTS.md             ← Week 7 Prompt Engineering Log
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)
- HuggingFace API key (free at huggingface.co)

### 1. Clone the repo
```bash
git clone https://github.com/mehaksethiii/Stay-INN_sight-AI.git
cd Stay-INN_sight-AI
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Setup Frontend
```bash
cd ..
npm install
npm start
```

### 4. Environment Variables
Create `backend/.env` with:
```env
PORT=5000
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/innsightai
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
HF_API_KEY=your_huggingface_key
GROQ_API_KEY=your_groq_key
```

---

## 🔌 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with JWT |
| POST | `/api/auth/google` | No | Google OAuth login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/reviews` | No | Get all reviews |
| POST | `/api/reviews` | Yes | Submit review (AI sentiment) |
| POST | `/api/ai/analyse` | Yes | Dual AI review analysis |
| POST | `/api/ai/chat` | Yes | AI chatbot message |

---

## 🌐 Live Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | [stay-inn-sight-ai-f3ov.vercel.app](https://stay-inn-sight-ai-f3ov.vercel.app) |
| Backend API | Render | [stay-inn-sight-ai.onrender.com](https://stay-inn-sight-ai.onrender.com) |
| Database | MongoDB Atlas | Hosted cluster (not public) |

### Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v7, Bootstrap 5, Firebase Auth |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| AI Engine | Groq LLaMA 3.1 → HuggingFace RoBERTa → Local NLP (fallback chain) |
| Auth | JWT + Firebase Google OAuth |
| Deployment | Vercel (frontend) + Render (backend) |

### ⚠️ Known Limitations on Free Tier

- **Render free tier** has a self-ping keep-alive built in (pings `/api/health` every 14 minutes), so the server stays warm. No cold-start delays.
- **Groq free tier** has a rate limit of 30 requests/minute. Hitting the limit falls back automatically to HuggingFace, then local NLP.
- **HuggingFace Inference API** free tier may queue requests during high traffic; the local NLP fallback ensures sentiment analysis always works.
- **MongoDB Atlas free cluster (M0)** has 512 MB storage and 100 max connections — sufficient for this project at current scale.

---

## 🔒 Security

- API keys stored only in `backend/.env` — never committed
- JWT authentication on all protected routes
- Rate limiting on AI endpoints (20 req/15min)
- Input sanitization + prompt injection prevention
- `backend/.env` listed in `.gitignore`
