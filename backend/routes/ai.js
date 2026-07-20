/**
 * ai.js — AI Routes
 * POST /api/ai/analyse — Dual HF + Groq analysis
 * POST /api/ai/chat    — Floating chatbot
 */

const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');
const requireAuth = require('../middleware/auth');

const { runDualAnalysis } = require('../services/analysis.service');
const { chat }            = require('../services/chatbot.service');

// ── Rate limiters ──────────────────────────────────────────────────────────────
const analyseLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many AI requests. Please wait.' } });
const chatLimiter    = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { success: false, message: 'Too many chat messages. Please wait.' } });

// ── Input sanitizer — basic prompt injection prevention ───────────────────────
function sanitize(text) {
  return String(text)
    .replace(/<[^>]*>/g, '')        // strip HTML
    .replace(/\bignore\b.{0,30}\binstructions?\b/gi, '')  // basic injection guard
    .trim()
    .slice(0, 2000);                // max length
}

// ─── POST /api/ai/analyse ──────────────────────────────────────────────────────
router.post('/analyse', requireAuth, analyseLimiter, async (req, res) => {
  try {
    const { reviewText, guestName } = req.body;

    if (!reviewText || reviewText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Review text must be at least 10 characters.' });
    }

    const text = sanitize(reviewText);
    const name = sanitize(guestName || 'Guest');

    const result = await runDualAnalysis(text, name);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('AI analyse error:', err.message);
    res.status(500).json({ success: false, message: 'AI analysis failed. Please try again.', error: err.message });
  }
});

// ─── POST /api/ai/chat ─────────────────────────────────────────────────────────
router.post('/chat', requireAuth, chatLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 1000 chars).' });
    }

    const cleanMessage = sanitize(message);
    const cleanHistory = Array.isArray(history)
      ? history.slice(-10).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: sanitize(m.content) }))
      : [];

    const response = await chat(cleanHistory, cleanMessage);

    res.status(200).json({ success: true, response });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ success: false, message: 'Chatbot unavailable. Please try again.', error: err.message });
  }
});

module.exports = router;
