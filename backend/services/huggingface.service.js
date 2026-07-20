/**
 * huggingface.service.js
 * Calls Hugging Face Inference API via native HTTPS
 * Uses Google DNS to bypass ISP-level blocks (works on Render/production)
 */

const https = require('https');
const dns = require('dns');

// Use Google DNS to resolve HuggingFace (bypasses ISP DNS blocks)
dns.setDefaultResultOrder('ipv4first');

const HF_API_KEY = process.env.HF_API_KEY;

/**
 * Generic HuggingFace model caller
 */
function callHFModel(model, inputs) {
  return new Promise((resolve, reject) => {
    if (!HF_API_KEY) return reject(new Error('HF_API_KEY not configured'));
    const body = JSON.stringify({ inputs, options: { wait_for_model: true } });

    const req = https.request(
      {
        hostname: 'api-inference.huggingface.co',
        path: `/models/${model}`,
        method: 'POST',
        family: 4,
        timeout: 25000,
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) return reject(new Error(`HF: ${parsed.error}`));
            resolve(parsed);
          } catch {
            reject(new Error('HF: bad JSON response'));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('HF: request timed out')); });
    req.write(body);
    req.end();
  });
}

/**
 * Sentiment analysis — returns { label, score, allScores }
 * Model: cardiffnlp/twitter-roberta-base-sentiment-latest
 */
async function callHFSentiment(text) {
  const result = await callHFModel(
    'cardiffnlp/twitter-roberta-base-sentiment-latest',
    `Hotel review by a guest: "${text}"`
  );
  const scores = result[0] || [];
  const top = scores.reduce((b, i) => (i.score > b.score ? i : b), { label: 'neutral', score: 0 });
  const label = top.label.toLowerCase()
    .replace('label_0', 'negative').replace('label_1', 'neutral').replace('label_2', 'positive');
  const sentimentGroup = label.includes('positive') ? 'positive' : label.includes('negative') ? 'negative' : 'neutral';
  return {
    label: sentimentGroup,
    confidence: Math.round(top.score * 100),
    allScores: scores.map(s => ({ label: s.label, confidence: Math.round(s.score * 100) })),
  };
}

/**
 * Emotion analysis — returns { label, confidence, allScores }
 * Model: j-hartmann/emotion-english-distilroberta-base
 */
async function callHFEmotion(text) {
  const result = await callHFModel(
    'j-hartmann/emotion-english-distilroberta-base',
    text
  );
  const scores = result[0] || [];
  const top = scores.reduce((b, i) => (i.score > b.score ? i : b), { label: 'neutral', score: 0 });
  return {
    label: top.label.toLowerCase(),
    confidence: Math.round(top.score * 100),
    allScores: scores.map(e => ({ label: e.label, confidence: Math.round(e.score * 100) })),
  };
}

module.exports = { callHFSentiment, callHFEmotion };
