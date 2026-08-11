# 🎬 5-Minute Demo Video Recording Script & Guide

> **Project**: INN Sight AI — Hotel & Homestay Review Intelligence Platform  
> **Intern Name**: Mehak Sethi | **Intern ID**: TBI-26101076  
> **Recommended Recording Tool**: Loom (loom.com), OBS Studio, or Windows Screen Recorder (`Win + Alt + R`)  
> **Target Duration**: Exactly 4:30 to 5:15 minutes

---

## ⏱️ Video Structure Breakdown

```
0:00 - 0:30  |  1. Introduction & Problem Statement
0:30 - 2:30  |  2. Core Flows: Auth, Dashboard & Full CRUD
2:30 - 3:30  |  3. AI Feature Demo: Dual Analysis, Summary & Chatbot
3:30 - 4:30  |  4. Code Tour & Architecture Walkthrough
4:30 - 5:00  |  5. Wrap-Up, Key Learnings & Future Roadmap
```

---

## 🎙️ Word-for-Word Speaking Script

### 📍 1. Introduction (0:00 - 0:30)
> *"Hello everyone! My name is Mehak Sethi, Intern ID TBI-26101076, and welcome to the capstone presentation for **INN Sight AI**.*  
> *Hotel and homestay managers receive hundreds of reviews weekly across platforms like Airbnb, Booking.com, and Google. Reading and replying to every single comment manually is time-consuming and prone to human oversight.*  
> *I built **INN Sight AI** as an end-to-end intelligent platform that classifies guest sentiment in real time, generates instant 1-sentence executive summaries, identifies recurring operational issues, and writes professional management replies in seconds."*

---

### 📍 2. Core Flows Walkthrough: Auth & CRUD Dashboard (0:30 - 2:30)
*(Screen: Open your live website at https://stay-inn-sight-ai-f3ov.vercel.app or localhost:3000)*

> *"Let’s start with the user experience. Here is the landing page featuring our warm luxury design palette, hero section, and interactive 3D review showcase cards.*  
> *Next, let’s log in. The application supports both standard email/password authentication via JWT and instant Google Sign-In via Firebase.*  
> *(Click Login → Sign In)*  
> *Once authenticated, we land on the **Management Dashboard**. This dashboard is completely wired to our live MongoDB Atlas database.*  
> *Here we can see our live reviews table. We can filter reviews by sentiment — Positive, Neutral, or Negative — or use the real-time search bar to search by guest name or keywords like 'food' or 'cleanliness'.*  
> *Let's perform a live CRUD action: I'll click **+ Add Review**, enter a guest name and review text. As soon as I click submit, the backend automatically classifies the sentiment using AI and inserts the record into MongoDB Atlas with zero reload.*  
> *We can also click **Edit** to update any review on the fly, or click **Delete** which opens a custom confirmation modal to prevent accidental data loss."*

---

### 📍 3. AI Feature Demonstration (2:30 - 3:30)
*(Screen: Navigate to `/ai-analyser`)*

> *"Now let's look at our flagship AI capability: the **AI Review Analyser & Summarizer**.*  
> *Here, managers can paste long, complex multi-paragraph reviews. Let me paste an example of a mixed guest review.*  
> *I can click **⚡ Summarize Review** or **Full AI Analysis**. In under 1.5 seconds, our backend runs **Groq LLaMA 3.1** and **HuggingFace RoBERTa** in parallel.*  
> *Look at the output:*  
> *1. A crisp **Executive Review Summary** that condenses the entire feedback into 1 sentence.*  
> *2. The overall sentiment badge with exact confidence percentage and emotion classification.*  
> *3. Detected operational themes like comfort, food, and staff.*  
> *4. Actionable business recommendations.*  
> *5. And a personalized, AI-crafted management response ready to be copied with one click.*  
> *We can also click this Figma glass button **Save & Add Review** to persist this analyzed review directly to our Dashboard!*  
> *Additionally, notice our floating **INN Sight AI Chatbot** at the bottom right. It features macOS window controls and answers domain-specific hotel management questions anytime."*

---

### 📍 4. Brief Code Tour & Architecture (3:30 - 4:30)
*(Screen: Switch to VS Code or your GitHub repository)*

> *"Now, let's take a quick look at the codebase structure.*  
> *In the backend under `services/`, we have our multi-tier AI fallback engine in `analysis.service.js` and `sentiment.service.js`.*  
> *We dispatch requests in parallel to Groq LLaMA 3.1 for deep reasoning and HuggingFace for emotion classification. If an external inference API experiences rate limiting, our system seamlessly cascades down to a local regex NLP fallback, guaranteeing 100% uptime with zero crashes.*  
> *On the frontend, all routes are protected with `ErrorBoundary.js`, and interactive components like our signature Antigravity cursor (`CustomCursor.js`) use HTML5 canvas particles to deliver a world-class user experience."*

---

### 📍 5. Wrap-Up & Conclusion (4:30 - 5:00)
> *"Over the 10 weeks of this internship, I’ve gained hands-on expertise in full-stack architecture, prompt engineering, multi-model AI fallbacks, cloud deployment on Vercel and Render, and responsive UI design.*  
> *Thank you to Graphic Era University and the TBI mentorship team for this incredible journey. The complete code and documentation are available on my GitHub repository. Thank you!"*

---

## 💡 Quick Tips for Recording:
1. Make sure your browser has the app open and tabs ready before hitting Record.
2. Keep your voice energetic and clear.
3. Once recorded, upload to YouTube as **Unlisted** and copy the video URL.
4. Replace `YOUR_VIDEO_ID_HERE` in `README.md` with your actual YouTube URL!
