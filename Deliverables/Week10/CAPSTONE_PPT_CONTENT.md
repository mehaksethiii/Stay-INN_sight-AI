# 📊 Capstone Presentation (PPT) — Slide-by-Slide Content

> **Project**: INN Sight AI — Hotel & Homestay Review Intelligence Platform  
> **Intern Name**: Mehak Sethi | **Intern ID**: TBI-26101076  
> **Institution**: Graphic Era University (TBI-GEU Internship Program)  
> **Target Format**: 10 to 12 Crisp, Bulleted Slides (Export to PDF)

---

## 🖥️ Slide 1: Title Slide (Cover)

### **INN Sight AI**
#### *Intelligent Hotel & Homestay Review Classifier and Sentiment Platform*

- **Intern Name**: Mehak Sethi
- **Intern ID**: `TBI-26101076`
- **University**: Graphic Era University (GEU)
- **Internship**: TBI-GEU Summer Internship 2026
- **Domain**: Full-Stack Web Development & Applied AI Integration

---

## 🎯 Slide 2: Problem Statement & Value Proposition

### **The Problem**
- **High Feedback Volume**: Hospitality hosts receive hundreds of unstructured reviews weekly across Airbnb, Booking.com, and Google.
- **Manual Overhead**: Reading and classifying complaints manually is slow and delays operational fixes.
- **Inconsistent Guest Responses**: Delayed or generic replies negatively impact brand reputation and repeat bookings.

### **Our Solution: INN Sight AI**
- **Automated AI Review Triage**: Instant sentiment and emotion classification upon submission.
- **1-Sentence Executive Summaries**: Condenses multi-paragraph reviews for rapid manager decision-making.
- **Auto-Generated Responses**: Crafts empathetic, context-aware management replies in seconds.

---

## 🛠️ Slide 3: Tech Stack & Architecture Rationale

| Layer | Technology | Why Chosen? |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vanilla CSS | High-performance component modularity, fluid animations, and zero framework bloat. |
| **Backend** | Node.js & Express 5 | Fast, non-blocking asynchronous event loop ideal for parallel AI API orchestration. |
| **Database** | MongoDB Atlas (Cloud) | Flexible JSON schema perfect for dynamic review payloads and nested AI metadata. |
| **AI Inference** | Groq LLaMA 3.1 & HuggingFace | Sub-second inference speeds via Groq LPU paired with RoBERTa precision emotion models. |
| **Authentication** | JWT + Firebase OAuth | Secure stateless token verification combined with seamless 1-click Google sign-in. |

---

## 📸 Slide 4: Frontend UI Showcase & Live Website

### **Live Frontend Link**: [https://stay-inn-sight-ai-f3ov.vercel.app](https://stay-inn-sight-ai-f3ov.vercel.app)

### **Key UI Highlights**:
- **Luxury Hospitality Aesthetic**: Warm ambient gradients, 3D tilt cards, and glassmorphism action buttons.
- **Interactive Management Dashboard**: Scoped user sessions, multi-attribute search, and sentiment filter pills.
- **Signature Antigravity Cursor**: HTML5 canvas stardust particle trail floating upwards against gravity.
- **Domain AI Assistant**: Floating macOS-style chatbot available on all authenticated screens.

*(Insert 2–3 screenshots: Landing Page, Management Dashboard, AI Analyser)*

---

## ⚡ Slide 5: Backend — Top 2 APIs & Testing Verification

### **1. AI Review Analysis & Summarizer (`POST /api/ai/analyse`)**
- **Function**: Dispatches review text in parallel to Groq LLaMA 3.1 and HuggingFace RoBERTa.
- **Output**: Returns 1-sentence Executive Summary, Sentiment confidence %, Emotion, Theme tags, and AI response.
- **Status**: `200 OK` (Average latency: ~1.2s via Groq LPU).

### **2. Live Review Management & AI Hook (`POST /api/reviews`)**
- **Function**: Validates input, triggers automatic sentiment classification, and persists record in MongoDB Atlas.
- **Security**: JWT Auth protected with rate limiting & input sanitization.
- **Status**: `201 Created` (Average latency: ~280ms).

*(Insert screenshot of Chrome DevTools Network Tab / Postman test showing 200 OK & 201 Created)*

---

## 🍃 Slide 6: Database Selection & Schema Design

### **Database**: MongoDB Atlas (Cloud NoSQL Database)
- **Why MongoDB?**: Document-oriented architecture naturally accommodates unstructured guest feedback, multi-theme arrays, and nested AI confidence scores without rigid migration constraints.

### **Core Schema Design (`Review.js`)**:
```javascript
{
  guestName: { type: String, required: true },
  reviewText: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  theme: { type: String, default: 'experience' },
  response: { type: String },
  confidence: { type: Number },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🤖 Slide 7: AI Architecture, LLMs & Real-World Use Case

### **Models Used**:
1. **Groq LLaMA 3.1-8B Instant**: Ultra-fast LLM used for deep reasoning, theme extraction, executive summaries, and empathetic reply generation.
2. **HuggingFace RoBERTa**: Transformer model fine-tuned on sentiment & emotion classification.
3. **Local Regex NLP Engine**: Offline rule-based fallback ensuring **100% uptime**.

### **Use Case & Workflow**:
```
[Guest Review] ──> [Parallel AI Dispatcher]
                      ├──> Groq LLaMA 3.1 (Reasoning + Summary)
                      ├──> HuggingFace (Emotion + Sentiment)
                      └──> Local NLP Fallback (Zero Downtime)
                             └──> Executive Summary + Management Reply
```

---

## ☁️ Slide 8: Hosting & Cloud Infrastructure

### **Production Deployment Architecture**:
- **Frontend (Vercel)**:
  - Global Edge CDN delivering instant static delivery.
  - Automated continuous deployment (CI/CD) hooked to GitHub `main` branch.
- **Backend (Render Web Services)**:
  - Containerized Node.js/Express environment with environment variable security.
  - Automated `/api/health` keep-alive monitoring to eliminate free-tier cold starts.
- **Database (MongoDB Atlas)**:
  - Cloud-hosted replica set with automatic TLS encryption and IP access control.

---

## 🔗 Slide 9: Project Deliverable Links

### **Publicly Accessible Project Links**:

- 🌐 **Live Application**:  
  [https://stay-inn-sight-ai-f3ov.vercel.app](https://stay-inn-sight-ai-f3ov.vercel.app)

- ⚙️ **Backend REST API**:  
  [https://stay-inn-sight-ai.onrender.com](https://stay-inn-sight-ai.onrender.com)

- 🐙 **GitHub Source Code Repository**:  
  [https://github.com/mehaksethiii/Stay-INN_sight-AI](https://github.com/mehaksethiii/Stay-INN_sight-AI)

- 💼 **LinkedIn Profile**:  
  [https://www.linkedin.com/in/mehak-sethi-946335322](https://www.linkedin.com/in/mehak-sethi-946335322)

---

## 💡 Slide 10: Reflection & Key Learnings

### **Technical Growth & Outcomes**:
- **Full-Stack Proficiency**: Architected and deployed a production React-Express-MongoDB stack from scratch.
- **Applied AI Mastery**: Designed multi-tier fallback pipelines chaining Groq Cloud with HuggingFace transformers.
- **UI/UX Excellence**: Built accessible design systems, interactive 3D physics, and custom HTML5 particle cursors.
- **DevOps & Cloud**: Hands-on experience with Vercel CI/CD, Render web services, and cloud database administration.

### **Internship Experience**:
- *"The 10-week TBI-GEU Internship provided an exceptional opportunity to build a real-world, production-ready product solving practical hospitality operational challenges with modern AI engineering."*

---

## 🙏 Slide 11: Thank You / Q&A Slide

### **Thank You!**

- **Presenter**: Mehak Sethi
- **Intern ID**: `TBI-26101076`
- **GitHub**: [@mehaksethiii](https://github.com/mehaksethiii)
- **Project**: INN Sight AI — Hotel & Homestay Review Intelligence Platform
- **Any Questions?**
