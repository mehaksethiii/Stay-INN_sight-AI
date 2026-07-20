# INN Sight AI — Hotel Review Intelligence Platform

> **Intern ID**: TBI-26101076 | **Week 7 — AI API Integration**

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

- **Frontend**: [Vercel](https://stay-inn-sight-ai-f3ov.vercel.app)
- **Backend**: Render (auto-deploys from GitHub)
- **Database**: MongoDB Atlas

---

## 🔒 Security

- API keys stored only in `backend/.env` — never committed
- JWT authentication on all protected routes
- Rate limiting on AI endpoints (20 req/15min)
- Input sanitization + prompt injection prevention
- `backend/.env` listed in `.gitignore`
