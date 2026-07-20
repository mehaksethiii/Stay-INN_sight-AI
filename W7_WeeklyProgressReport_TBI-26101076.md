# Week 7 — Weekly Progress Report
**Intern ID**: TBI-26101076  
**Name**: Mehak Sethi  
**Week**: Week 7 — AI API Integration  
**Date**: July 20, 2026  
**Project**: INN Sight AI — Hotel Review Intelligence Platform  
**GitHub**: https://github.com/mehaksethiii/Stay-INN_sight-AI  

---

## Work Completed This Week

### AI APIs Integrated
- **Groq (LLaMA 3.1-8b-instant)** — Primary AI engine for sentiment classification, deep review analysis, response generation, and chatbot
- **Hugging Face Inference API** — Secondary AI engine (cardiffnlp/twitter-roberta-base-sentiment-latest + j-hartmann/emotion-english-distilroberta-base) for sentiment and emotion scores

### Features Built

#### 1. AI Review Analyser (POST /api/ai/analyse)
- User inputs a hotel review → AI returns: sentiment label, confidence, detected emotion, detected themes (food/staff/cleanliness/location/comfort/value), key issues, recommendations, business insight, and a professional management response
- Built using Groq LLaMA 3.1 with structured JSON output
- 3-layer fallback: Groq → HuggingFace → Local NLP (never crashes)

#### 2. Floating AI Chatbot (POST /api/ai/chat)
- Domain-specific chatbot powered by Groq LLaMA 3.1
- Knows about all INN Sight AI platform features
- Supports: conversation history, markdown rendering, typing indicator, minimize/maximize/close window controls, suggested prompts, clear chat

#### 3. AI Sentiment on Review Submission (POST /api/reviews)
- Upgraded from keyword-matching to real AI sentiment classification
- Every review submission now calls Groq → stores AI-detected sentiment in MongoDB

### Backend Services Created
```
backend/services/
├── groq.service.js          — Groq LLaMA 3.1 API caller
├── huggingface.service.js   — HuggingFace API caller
├── sentiment.service.js     — Sentiment with 3-layer fallback
├── analysis.service.js      — Dual AI parallel analysis
└── chatbot.service.js       — Domain chatbot with system prompt
```

### Security Implemented
- API keys stored only in `backend/.env` — never committed to GitHub
- `backend/.env` listed in `.gitignore`
- Rate limiting on AI endpoints (20 req / 15 min for analysis, 50 req / 15 min for chat)
- Input sanitization and prompt injection prevention

### Prompt Engineering
- Tested 3 prompt variations for sentiment classification (documented in PROMPTS.md)
- Best prompt: Role + strict format + domain context (Variation 3)
- System prompts designed for hotel domain specificity

### Documentation Updated
- `PROMPTS.md` — Full prompt engineering log with 3 variations, examples, and analysis
- `README.md` — Updated with AI architecture, API routes, setup instructions

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| HuggingFace blocked on local ISP network | Built 3-layer fallback: Groq → HF → Local NLP |
| Groq returns unexpected JSON format sometimes | Added JSON cleanup (strip markdown fences) + try/catch |
| React hooks-rules-of-hooks ESLint error | Moved useState before early return in component |
| Old JWT token invalid after backend restart | User logs out and re-logs in to get fresh token |

---

## Learning Outcomes Achieved

- ✅ Integrated Groq AI API into backend service (CLO-5)
- ✅ Securely stored API keys using environment variables (CLO-5, CLO-4)
- ✅ Built user-facing AI feature with loading and error states (CLO-5, CLO-1)
- ✅ Wrote, tested, and iterated prompts for hotel review analysis (CLO-5, CLO-8)

---

## What's Running Live
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Analyser: http://localhost:3000/ai-analyser
- GitHub: https://github.com/mehaksethiii/Stay-INN_sight-AI
