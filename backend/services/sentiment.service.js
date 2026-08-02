/**
 * sentiment.service.js
 * AI-powered sentiment classifier with graceful fallback chain:
 * Groq (LLaMA 3.1) → HuggingFace → Local keyword NLP
 */

const { callGroq } = require('./groq.service');
const { callHFSentiment } = require('./huggingface.service');

// ─── Local keyword NLP fallback (no internet required) ────────────────────────
const POS_WORDS = ['great','excellent','amazing','wonderful','fantastic','love','loved','perfect','clean','friendly','helpful','delicious','beautiful','awesome','outstanding','superb','nice','good','enjoyed','happy','pleasant','comfortable','best','brilliant','exceptional','highly recommend','satisfied','impressed','lovely','splendid','spotless','warm','incredible','stunning','magnificent','delightful','peaceful','cozy','spacious','recommend','polite','attentive','gorgeous','immaculate'];
const NEG_WORDS = ['terrible','horrible','awful','disgusting','disgusted','dirty','rude','bad','worst','poor','disappointing','disappointed','unacceptable','filthy','broken','noisy','slow','cold','stale','overpriced','waste','never again','angry','upset','unhappy','smelly','cockroach','bug','mold','stain','pathetic','appalling','refund','rats','avoid','horrible','dreadful','catastrophic','unpleasant','mediocre','substandard','abysmal','atrocious','infested','leaking','smell','odor','staff was rude','not clean','not worth','not recommend','do not recommend','stay away','0 stars','1 star'];

function localSentiment(text) {
  const t = text.toLowerCase();
  const pos = POS_WORDS.filter(w => t.includes(w)).length;
  const neg = NEG_WORDS.filter(w => t.includes(w)).length;
  // Give negative words 1.5x weight — negative reviews tend to use fewer but stronger words
  const negWeighted = neg * 1.5;
  if (pos > negWeighted) return { sentiment: 'positive', confidence: Math.min(88, 65 + pos * 8), engine: 'local-nlp' };
  if (negWeighted > pos) return { sentiment: 'negative', confidence: Math.min(88, 65 + neg * 8), engine: 'local-nlp' };
  // Tie-break: if any negative words present, lean negative
  if (neg > 0) return { sentiment: 'negative', confidence: 66, engine: 'local-nlp' };
  return { sentiment: 'neutral', confidence: 65, engine: 'local-nlp' };
}

/**
 * Classify sentiment using AI with fallback chain
 * @param {string} text - Review text to classify
 * @returns {Promise<{ sentiment: string, confidence: number, engine: string }>}
 */
async function classifySentimentAI(text) {
  // Layer 1: Groq
  try {
    const response = await callGroq([
      {
        role: 'system',
        content: 'You are a hotel review sentiment classifier. Classify the sentiment as exactly one word: Positive, Negative, or Neutral. Use Neutral when the review contains BOTH positive and negative aspects. Use Positive only when overall experience is good. Use Negative only when the overall experience is bad. No explanation. No punctuation.',
      },
      {
        role: 'user',
        content: `Hotel review: "${text}"`,
      },
    ], { model: 'llama-3.1-8b-instant', temperature: 0.1, max_tokens: 5 });

    const word = response.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (['positive', 'negative', 'neutral'].includes(word)) {
      return { sentiment: word, confidence: 90, engine: 'groq-llama3' };
    }
    // If Groq returned unexpected word, fall through
    throw new Error(`Groq returned unexpected: ${response}`);
  } catch (err) {
    console.warn('Sentiment Groq failed:', err.message);
  }

  // Layer 2: HuggingFace — skip on Render (DNS not available on free tier)
  // Falls through directly to local NLP

  // Layer 3: Local NLP
  return localSentiment(text);
}

module.exports = { classifySentimentAI, localSentiment };
