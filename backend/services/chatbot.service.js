/**
 * chatbot.service.js
 * INN Sight AI Chatbot — powered by Groq LLaMA 3.1
 * Knows about the website, its features, and can answer general AI questions
 */

const { callGroq } = require('./groq.service');

// System prompt — defines the chatbot's personality and knowledge
const SYSTEM_PROMPT = `You are the official AI assistant of INN Sight AI — a hotel review management platform.

Your responsibilities:
- Help users navigate the website and understand its features
- Explain the Dashboard, Reviews, AI Analyser, and Profile pages
- Explain how AI sentiment analysis works
- Help users understand their review data and analytics
- Answer general questions about hospitality, hotel management, and AI
- Guide users on how to use each feature

Key features of INN Sight AI:
- **Dashboard**: View, filter, and manage all hotel guest reviews with AI-detected sentiment (positive/negative/neutral)
- **AI Analyser**: Deep dual analysis using Groq LLaMA 3.1 + HuggingFace — shows sentiment, emotion, themes, and generates professional management responses
- **Profile**: View your account details and authentication info
- **Auth**: Secure login with email/password or Google Sign-In (Firebase)

Communication style:
- Be concise, friendly, and professional
- Use markdown formatting (bold, bullet points, headers)
- Use emojis sparingly but effectively
- Never make up statistics or data you don't have
- If you don't know something, clearly say so
- Keep responses focused and helpful`;

/**
 * Process a chat message
 * @param {Array} history - Array of { role: 'user'|'assistant', content: string }
 * @param {string} newMessage - The latest user message
 * @returns {Promise<string>} - AI response text
 */
async function chat(history, newMessage) {
  // Build messages array with system prompt + conversation history
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    // Include last 10 messages max (5 exchanges) to manage tokens
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: newMessage },
  ];

  const response = await callGroq(messages, {
    model: 'llama-3.1-8b-instant',
    temperature: 0.6,
    max_tokens: 600,
  });

  return response;
}

module.exports = { chat };
