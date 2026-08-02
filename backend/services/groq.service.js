/**
 * groq.service.js
 * Calls Groq (LLaMA 3.1) via native HTTPS — no axios/fetch needed
 * Works on all networks including local ISP-restricted environments
 */

const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();

/**
 * Send a chat request to Groq LLaMA
 * @param {Array} messages - OpenAI-style messages array
 * @param {Object} options - { model, temperature, max_tokens }
 * @returns {Promise<string>} - The AI text response
 */
async function callGroq(messages, options = {}) {
  const {
    model = 'llama-3.1-8b-instant',
    temperature = 0.4,
    max_tokens = 500,
  } = options;

  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_key_here') {
    throw new Error('GROQ_API_KEY not configured');
  }

  const body = JSON.stringify({
    model,
    messages,
    temperature,
    max_tokens,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        family: 4,
        timeout: 20000,
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
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
            if (parsed.error) return reject(new Error(`Groq: ${parsed.error.message || JSON.stringify(parsed.error)}`));
            const text = parsed.choices?.[0]?.message?.content?.trim();
            if (!text) return reject(new Error('Groq: empty response'));
            resolve(text);
          } catch {
            reject(new Error('Groq: bad JSON response'));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Groq: request timed out')); });
    req.write(body);
    req.end();
  });
}

module.exports = { callGroq };
