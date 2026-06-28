const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

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
  if (t.includes('food') || t.includes('breakfast') || t.includes('lunch') || t.includes('dinner') || t.includes('meal') || t.includes('restaurant') || t.includes('cuisine') || t.includes('eat')) return 'food';
  if (t.includes('host') || t.includes('staff') || t.includes('owner') || t.includes('friendly') || t.includes('helpful') || t.includes('rude') || t.includes('service')) return 'host';
  if (t.includes('location') || t.includes('view') || t.includes('area') || t.includes('nearby') || t.includes('surroundings') || t.includes('place') || t.includes('situated')) return 'location';
  if (t.includes('clean') || t.includes('dirty') || t.includes('hygiene') || t.includes('neat') || t.includes('tidy') || t.includes('smelly') || t.includes('stain')) return 'cleanliness';
  if (t.includes('price') || t.includes('value') || t.includes('worth') || t.includes('expensive') || t.includes('cheap') || t.includes('affordable') || t.includes('cost')) return 'value';
  return 'experience';
}

function generateResponse(sentiment, theme, guestName) {
  const name = guestName.split(' ')[0];
  if (sentiment === 'positive') {
    return `Thank you ${name}! We are delighted you had a wonderful experience with us. We look forward to welcoming you again.`;
  }
  if (sentiment === 'negative') {
    const themeResponses = {
      food: `We sincerely apologize ${name} for the food experience. We will work on improving our menu quality.`,
      host: `We are sorry ${name} for the service experience. We will address this with our team immediately.`,
      cleanliness: `We apologize ${name} for the cleanliness issue. This is not our standard and we will fix it right away.`,
      location: `Thank you for your feedback ${name}. We will look into improving accessibility.`,
      value: `We are sorry you felt it wasn't value for money ${name}. We will review our pricing.`,
      experience: `We sincerely apologize ${name} for falling short of your expectations. Your feedback helps us improve.`,
    };
    return themeResponses[theme] || `We sincerely apologize ${name}. We will do better.`;
  }
  return `Thank you ${name} for your feedback. We appreciate your honest review and will use it to improve.`;
}


let reviews = [
  { id: 1, guestName: 'Priya Sharma', reviewText: 'Amazing stay! The room was clean and staff was very friendly.', sentiment: 'positive', theme: 'host', response: 'Thank you Priya! We are delighted to hear you enjoyed your stay.' },
  { id: 2, guestName: 'Rohan Mehta', reviewText: 'The location was great but the food quality was average.', sentiment: 'neutral', theme: 'food', response: 'Thank you for your feedback Rohan. We will work on improving our food quality.' },
  { id: 3, guestName: 'Ananya Singh', reviewText: 'The room was dirty and service was very slow. Disappointing experience.', sentiment: 'negative', theme: 'cleanliness', response: 'We sincerely apologize Ananya. This is not the experience we aim to provide.' },
  { id: 4, guestName: 'Vikram Joshi', reviewText: 'Beautiful property with stunning views. Will definitely come back!', sentiment: 'positive', theme: 'location', response: 'Thank you Vikram! We look forward to welcoming you again.' },
  { id: 5, guestName: 'Meera Patel', reviewText: 'Great value for money. Comfortable rooms and helpful staff.', sentiment: 'positive', theme: 'value', response: 'Thank you Meera! We are glad you found great value in your stay.' },
];

let nextId = 6;

// ===== ROUTES =====

// GET /api/reviews — get all reviews
app.get('/api/reviews', (req, res) => {
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// GET /api/reviews/search?q= — search reviews (must be before /:id)
app.get('/api/reviews/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const results = reviews.filter(r =>
    r.reviewText.toLowerCase().includes(q) ||
    r.guestName.toLowerCase().includes(q) ||
    r.theme.toLowerCase().includes(q)
  );
  res.status(200).json({ success: true, count: results.length, data: results });
});

// GET /api/reviews/filter?sentiment= — filter by sentiment (must be before /:id)
app.get('/api/reviews/filter', (req, res) => {
  const { sentiment } = req.query;
  const results = sentiment ? reviews.filter(r => r.sentiment === sentiment) : reviews;
  res.status(200).json({ success: true, count: results.length, data: results });
});

// GET /api/reviews/:id — get single review
app.get('/api/reviews/:id', (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  res.status(200).json({ success: true, data: review });
});

// POST /api/reviews — create a new review
app.post('/api/reviews', (req, res) => {
  const { guestName, reviewText, experienceType } = req.body;
  if (!guestName || !reviewText) {
    return res.status(400).json({ success: false, message: 'guestName and reviewText are required' });
  }
  // Auto classify using rule-based classifier
  const sentiment = classifySentiment(reviewText);
  const theme = experienceType || classifyTheme(reviewText);
  const response = generateResponse(sentiment, theme, guestName);

  const newReview = { id: nextId++, guestName, reviewText, sentiment, theme, response };
  reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});

// PUT /api/reviews/:id — update a review
app.put('/api/reviews/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Review not found' });
  reviews[index] = { ...reviews[index], ...req.body };
  res.status(200).json({ success: true, data: reviews[index] });
});

// DELETE /api/reviews/:id — delete a review
app.delete('/api/reviews/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Review not found' });
  reviews.splice(index, 1);
  res.status(204).send();
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
