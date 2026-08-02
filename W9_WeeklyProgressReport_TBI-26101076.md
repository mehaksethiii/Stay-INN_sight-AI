# W9 Weekly Progress Report
**Intern ID:** TBI-26101076
**Week:** 9 — App Deployment & Go-Live
**Project:** INN Sight AI — Hotel Review Intelligence Platform
**GitHub Repo:** https://github.com/mehaksethiii/Stay-INN_sight-AI

---

## 1. Summary of Work Done This Week

This week focused entirely on taking the full-stack application from localhost to live production. Both the React frontend and the Node.js/Express backend are now publicly accessible. All core features — authentication, CRUD, AI sentiment analysis, AI review analyser, and the floating chatbot — have been verified on the live URLs.

---

## 2. Live Deployment URLs

| Layer | Platform | Live URL |
|-------|----------|----------|
| Frontend | Vercel | https://stay-inn-sight-ai-f3ov.vercel.app |
| Backend API | Render | https://stay-inn-sight-ai.onrender.com |
| Database | MongoDB Atlas | Hosted cluster — not public |
| Health Check | Render | https://stay-inn-sight-ai.onrender.com/api/health |

---

## 3. Deployment Steps Completed

### Frontend — Vercel
- Imported GitHub repo (`mehaksethiii/Stay-INN_sight-AI`) into Vercel
- Set root directory to project root (Create React App structure)
- Added environment variable on Vercel dashboard:
  - `REACT_APP_API_URL` = `https://stay-inn-sight-ai.onrender.com`
- Created `.env.production` in repo root so `npm run build` bakes the Render URL in automatically
- Vercel auto-deploys on every push to `main`

### Backend — Render
- Connected GitHub repo to Render as a Web Service
- Set root directory to `backend/`
- Build command: `npm install`
- Start command: `npm start`
- Added environment variables via Render dashboard:
  - `MONGO_URL`, `JWT_SECRET`, `HF_API_KEY`, `GROQ_API_KEY`, `FIREBASE_PROJECT_ID`
  - `FRONTEND_URL` = `https://stay-inn-sight-ai-f3ov.vercel.app`
  - `NODE_ENV` = `production`
- Render auto-deploys on every push to `main`

### CORS Configuration
- Updated `backend/server.js` to build the `allowedOrigins` array dynamically:
  - `http://localhost:3000` and `http://localhost:3001` for local dev
  - `https://stay-inn-sight-ai-f3ov.vercel.app` as hardcoded production fallback
  - `process.env.FRONTEND_URL` as an overridable env var
- No more hardcoded single origin string — any future Vercel URL can be added via dashboard only

### Keep-Alive Self-Ping (No Cold Starts)
- Added `GET /api/health` endpoint returning `{ status: 'ok', timestamp }`
- Inside `app.listen`, when `RENDER` env var is present (injected automatically by Render):
  - A `setInterval` fires every **14 minutes**
  - Pings `https://stay-inn-sight-ai.onrender.com/api/health` using Node's built-in `https` module
  - Logs `[keep-alive] ping → 200` in Render's live log stream
- Result: server stays warm 24/7 — zero cold-start delays for any user

---

## 4. End-to-End Testing on Live URL

| Feature | Status | Notes |
|---------|--------|-------|
| Home page loads | ✅ | All images, animations, navbar render correctly |
| Register (email/password) | ✅ | JWT returned, stored in localStorage |
| Login (email/password) | ✅ | Auth state persists across refresh |
| Google OAuth login | ✅ | Firebase popup → backend `/api/auth/google` → JWT |
| Dashboard loads reviews | ✅ | Fetches from MongoDB Atlas via Render API |
| Add review (AI sentiment) | ✅ | Groq → HF → Local NLP fallback chain works in production |
| Edit review | ✅ | PUT request updates MongoDB document |
| Delete review | ✅ | DELETE with confirm modal works |
| AI Review Analyser page | ✅ | Full Groq LLaMA 3.1 analysis returns in production |
| Floating AI Chatbot | ✅ | Chatbot responses via Render backend |
| Profile page | ✅ | Fetches `/api/auth/me` correctly |
| Protected routes redirect | ✅ | Unauthenticated users sent to `/login` |

---

## 5. Bugs Encountered & Fixed

| Bug | Root Cause | Fix |
|-----|------------|-----|
| CORS error on login | `FRONTEND_URL` env var not set on Render | Hardcoded Vercel URL as fallback in `allowedOrigins` array |
| Backend sleeping (30s cold start) | Render free tier 15-min idle spin-down | Self-ping `setInterval` every 14 min on `RENDER` env detection |
| `REACT_APP_API_URL` undefined in build | No `.env.production` file | Created `.env.production` with Render URL committed to repo |

---

## 6. Files Changed This Week

| File | Change |
|------|--------|
| `backend/server.js` | Dynamic CORS, `/api/health` endpoint, keep-alive self-ping |
| `backend/.env.example` | Added `FRONTEND_URL`, `NODE_ENV` documentation |
| `.env.production` | New — bakes `REACT_APP_API_URL` into Vercel build |
| `render.yaml` | New — Render service config (root dir, build/start commands) |
| `README.md` | Updated live URLs table, tech stack, known limitations |

---

## 7. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v7, Bootstrap 5, Firebase Auth |
| Backend | Node.js 18+, Express 5, Mongoose |
| Database | MongoDB Atlas (M0 free cluster) |
| AI Engine | Groq LLaMA 3.1 → HuggingFace RoBERTa → Local NLP |
| Auth | JWT + Firebase Google OAuth |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 8. Known Limitations on Free Tier

- **Render keep-alive is active** — self-ping every 14 min prevents cold starts entirely
- **Groq free tier** — 30 req/min rate limit; fallback chain (HF → Local NLP) ensures zero downtime
- **HuggingFace free tier** — may queue under high traffic; local NLP fallback always available
- **MongoDB Atlas M0** — 512 MB storage, 100 max connections; adequate for current usage

---

## 9. Learning Outcomes Achieved

| Outcome | CLO |
|---------|-----|
| Deployed React frontend to Vercel with environment variables | CLO-6 |
| Deployed Node.js backend to Render with environment variables | CLO-6 |
| Debugged CORS errors in production | CLO-6 |
| Implemented keep-alive mechanism for free-tier backend | CLO-6 |
| Verified end-to-end functionality on live public URL | CLO-6, CLO-2, CLO-5 |
