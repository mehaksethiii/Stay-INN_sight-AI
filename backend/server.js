const express = require('express');
const cors = require('cors');
// restart trigger for rate limit reset
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL, // Production Vercel URL — set on Render dashboard
].filter(Boolean); // removes undefined if FRONTEND_URL is not set

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// ===== CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== MODELS =====
const Review = require('./models/Review');
const requireAuth = require('./middleware/auth');

// ===== AI SERVICES =====
const { classifySentimentAI } = require('./services/sentiment.service');

// ===== AUTH ROUTES =====
app.use('/api/auth', require('./routes/auth'));

// ===== AI ROUTES =====
app.use('/api/ai', require('./routes/ai'));

// ===== RULE-BASED CLASSIFIER =====
function classifySentiment(text) {
  const t = text.toLowerCase();
  const positiveWords = ['amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'loved', 'beautiful', 'perfect', 'best', 'friendly', 'clean', 'comfortable', 'helpful', 'good', 'nice', 'enjoyed', 'happy', 'satisfied', 'recommend', 'superb', 'outstanding', 'pleasant', 'delightful', 'cozy'];
  const negativeWords = ['dirty', 'terrible', 'awful', 'bad', 'worst', 'horrible', 'disgusting', 'rude', 'slow', 'disappointed', 'disappointing', 'poor', 'noisy', 'broken', 'cold', 'unfriendly', 'waste', 'overpriced', 'stained', 'smelly', 'rats', 'cockroach', 'avoid'];
  let posScore = positiveWords.filter(w => t.includes(w)).length;
  let negScore = negativeWords.filter(w => t.includes(w)).length;
  if (posScore > negScore) return 'positive';
  if (negScore > posScore) return 'negative';
  return 'neutral';
}

function classifyTheme(text) {
  const t = text.toLowerCase();
  if (t.includes('food') || t.includes('breakfast') || t.includes('lunch') || t.includes('dinner') || t.includes('meal') || t.includes('eat')) return 'food';
  if (t.includes('host') || t.includes('staff') || t.includes('owner') || t.includes('friendly') || t.includes('helpful') || t.includes('rude') || t.includes('service')) return 'host';
  if (t.includes('location') || t.includes('view') || t.includes('area') || t.includes('nearby') || t.includes('surroundings') || t.includes('place')) return 'location';
  if (t.includes('clean') || t.includes('dirty') || t.includes('hygiene') || t.includes('neat') || t.includes('smelly') || t.includes('stain')) return 'cleanliness';
  if (t.includes('price') || t.includes('value') || t.includes('worth') || t.includes('expensive') || t.includes('cheap') || t.includes('affordable')) return 'value';
  return 'experience';
}

function generateResponse(sentiment, theme, guestName) {
  const name = guestName.split(' ')[0];
  if (sentiment === 'positive') return `Thank you ${name}! We are delighted you had a wonderful experience. We look forward to welcoming you again.`;
  if (sentiment === 'negative') {
    const responses = {
      food: `We sincerely apologize ${name} for the food experience. We will improve our menu quality.`,
      host: `We are sorry ${name} for the service experience. We will address this immediately.`,
      cleanliness: `We apologize ${name} for the cleanliness issue. This is not our standard.`,
      location: `Thank you for your feedback ${name}. We will look into improving accessibility.`,
      value: `We are sorry you felt it wasn't value for money ${name}. We will review our pricing.`,
      experience: `We sincerely apologize ${name} for falling short of your expectations.`,
    };
    return responses[theme] || `We sincerely apologize ${name}. We will do better.`;
  }
  return `Thank you ${name} for your feedback. We appreciate your honest review.`;
}

// ===== ROUTES =====

// GET /api/reviews — get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/search?q= — search (must be before /:id)
app.get('/api/reviews/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const reviews = await Review.find({
      $or: [
        { reviewText: { $regex: q, $options: 'i' } },
        { guestName: { $regex: q, $options: 'i' } },
        { theme: { $regex: q, $options: 'i' } },
      ]
    });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/filter?sentiment= — filter (must be before /:id)
app.get('/api/reviews/filter', async (req, res) => {
  try {
    const { sentiment } = req.query;
    const reviews = await Review.find(sentiment ? { sentiment } : {});
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/:id — get single review
app.get('/api/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews — create review with AI sentiment (protected)
app.post('/api/reviews', requireAuth, async (req, res) => {
  try {
    const { guestName, reviewText, experienceType } = req.body;
    if (!guestName || !reviewText) return res.status(400).json({ success: false, message: 'guestName and reviewText are required' });

    // AI sentiment classification (Groq → HF → Local NLP)
    const aiSentiment = await classifySentimentAI(reviewText);
    const sentiment = aiSentiment.sentiment;

    // Rule-based theme + response (preserved)
    const theme = experienceType || classifyTheme(reviewText);
    const response = generateResponse(sentiment, theme, guestName);

    const review = await Review.create({ guestName, reviewText, sentiment, theme, response, experienceType });
    res.status(201).json({
      success: true,
      data: review,
      aiMeta: { sentimentEngine: aiSentiment.engine, confidence: aiSentiment.confidence },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/reviews/:id — update review (protected)
app.put('/api/reviews/:id', requireAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id — delete review (protected)
app.delete('/api/reviews/:id', requireAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== HEALTH CHECK (used by keep-alive ping) =====
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // ===== KEEP-ALIVE SELF-PING (prevents Render free tier sleep) =====
  // Render spins down services after 15 min of inactivity on the free tier.
  // This pings the backend's own /api/health endpoint every 14 minutes
  // so it never goes idle. Only runs in production.
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || `https://stay-inn-sight-ai.onrender.com`;
    const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    setInterval(async () => {
      try {
        const https = require('https');
        https.get(`${BACKEND_URL}/api/health`, (res) => {
          console.log(`[keep-alive] ping → ${res.statusCode}`);
        }).on('error', (err) => {
          console.warn(`[keep-alive] ping failed: ${err.message}`);
        });
      } catch (e) {
        console.warn('[keep-alive] error:', e.message);
      }
    }, PING_INTERVAL_MS);

    console.log(`[keep-alive] Self-ping active every 14 min → ${BACKEND_URL}/api/health`);
  }
});
