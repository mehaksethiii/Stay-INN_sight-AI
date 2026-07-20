/**
 * sentiment.service.js
 * AI-powered sentiment classifier with graceful fallback chain:
 * Groq (LLaMA 3.1) → HuggingFace → Local keyword NLP
 */

const { callGroq } = require('./groq.service');
const { callHFSentiment } = require('./huggingface.service');

// ─── Local keyword NLP fallback (no internet required) ────────────────────────
const POS_WORDS = ['great','excellent','amazing','wonderful','fantastic','love','perfect','clean','friendly','helpful','delicious','beautiful','awesome','outstanding','superb','nice','good','enjoyed','happy','pleasant','comfortable','best','brilliant','exceptional','highly recommend','satisfied','impressed','lovely','splendid','spotless','warm'];
const NEG_WORDS = ['terrible','horrible','awful','disgusting','dirty','rude','bad','worst','poor','disappointing','unacceptable','filthy','broken','noisy','slow','cold','stale','overpriced','waste','never again','angry','upset','unhappy','disgusted','smelly','cockroach','bug','mold','stain','pathetic','disgusted','appalling'];

function localSentiment(text) {
  const t = text.toLowerCase();
  const pos = POS_WORDS.filter(w => t.includes(w)).length;
  const neg = NEG_WORDS.filter(w => t.includes(w)).length;
  if (pos > neg) return { sentiment: 'positive', confidence: Math.min(88, 65 + pos * 8), engine: 'local-nlp' };
  if (neg > pos) return { sentiment: 'negative', confidence: Math.min(88, 65 + neg * 8), engine: 'local-nlp' };
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
        content: 'You are an expert sentiment analysis model. Return ONLY one word. Positive, Negative, or Neutral. No explanation. No punctuation.',
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

  // Layer 2: HuggingFace
  try {
    const hf = await callHFSentiment(text);
    return { sentiment: hf.label, confidence: hf.confidence, engine: 'huggingface' };
  } catch (err) {
    console.warn('Sentiment HF failed:', err.message);
  }

  // Layer 3: Local NLP
  return localSentiment(text);
}

module.exports = { classifySentimentAI, localSentiment };
