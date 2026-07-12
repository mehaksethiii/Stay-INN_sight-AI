const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'https://stay-inn-sight-ai-f3ov.vercel.app'] }));
app.use(express.json());

// ===== CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== MODELS =====
const Review = require('./models/Review');
const requireAuth = require('./middleware/auth');

// ===== AUTH ROUTES =====
app.use('/api/auth', require('./routes/auth'));

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

// POST /api/reviews — create review (protected)
app.post('/api/reviews', requireAuth, async (req, res) => {
  try {
    const { guestName, reviewText, experienceType } = req.body;
    if (!guestName || !reviewText) return res.status(400).json({ success: false, message: 'guestName and reviewText are required' });
    const sentiment = classifySentiment(reviewText);
    const theme = experienceType || classifyTheme(reviewText);
    const response = generateResponse(sentiment, theme, guestName);
    const review = await Review.create({ guestName, reviewText, sentiment, theme, response, experienceType });
    res.status(201).json({ success: true, data: review });
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

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
