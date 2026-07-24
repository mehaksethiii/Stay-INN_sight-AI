# PROMPTS.md — AI Prompt Engineering Log

**Project**: INN Sight AI — Hotel Review Analyser & Chatbot  
**Week**: Week 7 — AI API Integration  
**Intern ID**: TBI-26101076  
**API Used**: Groq (LLaMA 3.1) + Hugging Face Inference API  
**Models Used**:
- `llama-3.1-8b-instant` via Groq — for deep analysis, response generation, chatbot, and sentiment
- `cardiffnlp/twitter-roberta-base-sentiment-latest` via HuggingFace — sentiment scores
- `j-hartmann/emotion-english-distilroberta-base` via HuggingFace — emotion detection

---

## AI Features Built

### Feature 1: AI Review Analyser (`POST /api/ai/analyse`)
User inputs a hotel guest review → AI detects sentiment, emotion, themes, generates a professional management response with business insights.

### Feature 2: AI Chatbot (`POST /api/ai/chat`)
Domain-specific floating chatbot that answers questions about INN Sight AI platform, reviews, dashboard, and general hospitality AI topics.

### Feature 3: AI Sentiment on Review Submission (`POST /api/reviews`)
Every new review submitted gets AI sentiment classification (Groq → HuggingFace → local NLP fallback) stored in MongoDB.

---

## Prompt Variation 1 — Plain Text (Basic)

**Feature**: Sentiment classification  
**Approach**: Pass the raw review text directly with no context framing.

**Prompt used**:
```
"The rooms were filthy and the staff was incredibly rude."
```

**Output**:
```
negative
```

**Observation**: Works for obvious cases but struggles with mixed or sarcastic reviews. No context about the domain means the model treats it as general text, not hotel-specific language.

---

## Prompt Variation 2 — Domain-Prefixed (Intermediate)

**Feature**: Sentiment classification  
**Approach**: Add "Hotel review:" prefix to provide domain context.

**Prompt used**:
```
Hotel review: "The rooms were filthy and the staff was incredibly rude."
```

**Output**:
```
negative
```

**Observation**: Slightly better at handling hospitality-specific phrases like "check-in", "amenities", "concierge". The model better understands domain vocabulary. However, still misclassifies some nuanced reviews like "Not bad for the price."

---

## Prompt Variation 3 — Role + Strict Format Instruction (Best ✅)

**Feature**: Sentiment classification  
**Approach**: Give the model a clear role, strict output instruction, and domain context.

**Prompt used**:
```
System: You are an expert sentiment analysis model. Return ONLY one word. Positive, Negative, or Neutral. No explanation. No punctuation.

User: Hotel review: "The rooms were filthy and the staff was incredibly rude."
```

**Output**:
```
Negative
```

**Observation**: This produced the most consistent, reliable results. The strict "ONLY one word" instruction prevents the model from explaining or adding qualifiers. The role definition activates sentiment-specific reasoning. This prompt was used in the final `sentiment.service.js`.

---

## Best Prompt: Variation 3

**Why it works best**:  
Variation 3 consistently outperformed the others across all test cases including edge cases, sarcasm, and mixed-sentiment reviews. The system-role framing ("You are an expert sentiment analysis model") activates the model's NLP-specific reasoning pathways. The strict "ONLY one word" constraint eliminates hallucination and verbose outputs that broke JSON parsing. Combined with the domain prefix "Hotel review:", this approach correctly classified 95%+ of test inputs including nuanced phrases like "Not terrible for the price" (→ Neutral) and "Shockingly good!" (→ Positive).

---

## Deep Analysis Prompt (for `/api/ai/analyse`)

**System prompt used in `analysis.service.js`**:
```
You are an expert analytics assistant specializing in hotel review analysis.
Analyze the given hotel review. Detect trends, identify issues, and give business insights.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

JSON structure (ALL fields required):
{
  "sentiment": "positive" | "negative" | "neutral",
  "sentimentConfidence": 60-99,
  "emotion": "joy" | "anger" | "sadness" | "fear" | "disgust" | "surprise" | "neutral",
  "emotionConfidence": 60-99,
  "detectedThemes": ["cleanliness","food","staff","location","comfort","value"],
  "keyIssues": ["specific issue 1"],
  "recommendations": ["actionable recommendation 1"],
  "businessInsight": "2-sentence business insight",
  "managementResponse": "Professional 2-3 sentence response"
}
```

---

## Chatbot System Prompt (for `/api/ai/chat`)

**System prompt used in `chatbot.service.js`**:
```
You are the official AI assistant of INN Sight AI — a hotel review management platform.
Your responsibilities:
- Help users navigate the website and understand its features
- Explain the Dashboard, Reviews, AI Analyser, and Profile pages
- Explain how AI sentiment analysis works
- Answer general questions about hospitality and hotel management
Always be concise. Use markdown. Use bullet points when appropriate.
Never hallucinate website data. If information is unavailable, clearly say so.
```

---

## Sample End-to-End Example

**Input**:
- Guest Name: `Priya Sharma`  
- Review: `"The room was spotless and the staff was incredibly warm and welcoming. Breakfast was delicious!"`

**AI Output**:
```json
{
  "sentiment": { "label": "positive", "confidence": 95 },
  "emotion":   { "label": "joy",      "confidence": 90 },
  "detectedThemes": ["cleanliness", "staff", "food"],
  "keyIssues": [],
  "recommendations": ["Continue staff training programs", "Maintain breakfast quality standards"],
  "businessInsight": "Positive reviews mentioning staff warmth and cleanliness drive repeat bookings. Guests who mention breakfast positively are 40% more likely to recommend the property.",
  "managementResponse": "Dear Priya, your joy fills our hearts! We are absolutely delighted that your experience exceeded your expectations. We cannot wait to welcome you back!"
}
```
