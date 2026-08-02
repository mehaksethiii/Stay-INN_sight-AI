/**
 * analysis.service.js
 * Dual AI Analysis — runs Groq + HuggingFace IN PARALLEL
 * Combines both results into a final intelligent verdict with summary
 */

const { callGroq } = require('./groq.service');
const { callHFSentiment, callHFEmotion } = require('./huggingface.service');

const EMOTION_EMOJI = { joy:'😊', anger:'😠', sadness:'😢', fear:'😨', disgust:'🤢', surprise:'😲', neutral:'😐' };

// ─── Groq deep analysis ────────────────────────────────────────────────────────
async function runGroqAnalysis(reviewText, guestName) {
  const prompt = `You are an expert analytics assistant specializing in hotel review analysis.
Analyze the given hotel review. Detect trends, identify issues, summarize key points, and give business insights.
Return ONLY valid JSON — no markdown, no code fences, no explanation.

Sentiment rules:
- "positive": overall experience was good/great, minor issues are acceptable
- "negative": overall experience was bad, guest is unhappy or wants refund
- "neutral": review contains BOTH clear positives AND clear negatives (mixed review)

Review: "${reviewText}"
Guest: "${guestName}"

JSON structure (ALL fields required):
{
  "summary": "Clear 1-sentence executive summary of the guest review in 15 words or less",
  "sentiment": "positive" | "negative" | "neutral",
  "sentimentConfidence": 60-99,
  "emotion": "joy" | "anger" | "sadness" | "fear" | "disgust" | "surprise" | "neutral",
  "emotionConfidence": 60-99,
  "detectedThemes": ["cleanliness","food","staff","location","comfort","value"],
  "keyIssues": ["specific issue 1", "specific issue 2"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2"],
  "businessInsight": "2-sentence business insight about this review pattern",
  "managementResponse": "Professional 2-3 sentence response addressed to ${guestName}"
}`;

  const raw = await callGroq(
    [{ role: 'user', content: prompt }],
    { model: 'llama-3.1-8b-instant', temperature: 0.3, max_tokens: 650 }
  );
  const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

// ─── HuggingFace dual model analysis ──────────────────────────────────────────
async function runHFAnalysis(reviewText) {
  const [sentiment, emotion] = await Promise.all([
    callHFSentiment(reviewText),
    callHFEmotion(reviewText),
  ]);
  return { sentiment, emotion };
}

// ─── Theme detector (shared) ──────────────────────────────────────────────────
function detectThemes(text) {
  const t = text.toLowerCase();
  const themeMap = {
    cleanliness: ['clean','dirty','hygiene','stain','smelly','dust','mold','cockroach','filthy'],
    food:        ['food','breakfast','lunch','dinner','meal','eat','taste','restaurant','menu','dish'],
    staff:       ['staff','host','service','rude','friendly','helpful','attitude','manager','receptionist'],
    location:    ['location','view','nearby','area','accessible','transport','neighbourhood'],
    comfort:     ['comfortable','bed','sleep','noise','quiet','room','pillow','temperature','ac','wifi'],
    value:       ['price','value','expensive','cheap','affordable','worth','money','cost','overpriced'],
  };
  const found = Object.entries(themeMap).filter(([,kws]) => kws.some(k => t.includes(k))).map(([th]) => th);
  return found.length ? found : ['general experience'];
}

// ─── Build management response from templates ─────────────────────────────────
function buildTemplateResponse(name, sentiment, emotion) {
  const t = {
    positive: {
      joy:     `Dear ${name}, your joy fills our hearts! We are absolutely delighted your experience exceeded expectations. We cannot wait to welcome you back!`,
      surprise:`What a wonderful surprise, ${name}! We are overjoyed we could exceed your expectations. Our team works hard every day to create these moments — see you again soon!`,
      default: `Thank you so much, ${name}! We are thrilled you had a positive experience. Your kind words motivate our entire team and we look forward to making your next visit even more memorable!`,
    },
    negative: {
      anger:   `Dear ${name}, we sincerely apologize. Your frustration is completely valid and we take this very seriously. We are investigating immediately — please reach out directly so we can make this right.`,
      disgust: `We are deeply sorry, ${name}. What you described falls far below our standards. Immediate corrective steps are being taken and we would welcome the opportunity to restore your faith in us.`,
      sadness: `Dear ${name}, your feedback has deeply moved us. We are truly sorry for falling short of expectations. Our management team has been alerted and we are committed to significant improvements.`,
      fear:    `Dear ${name}, your safety is our absolute top priority. We are alarmed by your experience and immediately reviewing our security procedures. We deeply regret any distress caused.`,
      default: `Dear ${name}, we sincerely apologize for the shortcomings you experienced. Your feedback is invaluable and we are actively working to address every issue you raised.`,
    },
    neutral:  {
      default: `Thank you for sharing your experience, ${name}. Your balanced feedback is truly valuable — we appreciate your honest review and hope to provide an excellent experience on your next visit!`,
    },
  };
  const g = t[sentiment] || t.neutral;
  return g[emotion] || g.default || t.neutral.default;
}

/**
 * Run full dual analysis in parallel
 * @returns { groq, huggingface, combined, themes }
 */
async function runDualAnalysis(reviewText, guestName) {
  const name = (guestName || 'Guest').split(' ')[0];
  const themes = detectThemes(reviewText);

  // Run both in parallel — collect results without crashing if one fails
  const [groqResult, hfResult] = await Promise.allSettled([
    runGroqAnalysis(reviewText, name),
    runHFAnalysis(reviewText),
  ]);

  // ── Groq result ──
  let groq = null;
  if (groqResult.status === 'fulfilled') {
    const g = groqResult.value;
    groq = {
      summary: g.summary || `Guest review highlights ${themes.join(', ')} experience.`,
      sentiment: { label: g.sentiment || 'neutral', confidence: g.sentimentConfidence || 82 },
      emotion:   { label: g.emotion   || 'neutral', confidence: g.emotionConfidence   || 78 },
      detectedThemes: g.detectedThemes?.length ? g.detectedThemes : themes,
      keyIssues: g.keyIssues || [],
      recommendations: g.recommendations || [],
      businessInsight: g.businessInsight || '',
      managementResponse: g.managementResponse || buildTemplateResponse(name, g.sentiment || 'neutral', g.emotion || 'neutral'),
      engine: 'groq-llama3',
      status: 'success',
    };
  } else {
    groq = { status: 'error', error: groqResult.reason?.message || 'Groq unavailable', engine: 'groq-llama3' };
    console.warn('Groq analysis failed:', groqResult.reason?.message);
  }

  // ── HuggingFace result ──
  let hf = null;
  if (hfResult.status === 'fulfilled') {
    const h = hfResult.value;
    hf = {
      sentiment: { label: h.sentiment.label, confidence: h.sentiment.confidence, breakdown: h.sentiment.allScores },
      emotion:   { label: h.emotion.label,   confidence: h.emotion.confidence,   breakdown: h.emotion.allScores },
      detectedThemes: themes,
      engine: 'huggingface',
      status: 'success',
    };
  } else {
    hf = { status: 'error', error: hfResult.reason?.message || 'HuggingFace unavailable', engine: 'huggingface' };
    console.warn('HuggingFace analysis failed:', hfResult.reason?.message);
  }

  // ── Combined verdict — intelligently merge both ──
  const groqSentiment = groq?.status === 'success' ? groq.sentiment.label : null;
  const hfSentiment   = hf?.status   === 'success' ? hf.sentiment.label   : null;

  let verdictSentiment = groqSentiment || hfSentiment || 'neutral';
  let verdictConfidence = 90;
  let agreement = true;
  if (groqSentiment && hfSentiment && groqSentiment !== hfSentiment) {
    agreement = false;
    verdictSentiment = groqSentiment;
    verdictConfidence = 72;
  }

  const verdictEmotion = groq?.status === 'success' ? groq.emotion.label : (hf?.status === 'success' ? hf.emotion.label : 'neutral');
  const verdictResponse = groq?.status === 'success'
    ? groq.managementResponse
    : buildTemplateResponse(name, verdictSentiment, verdictEmotion);

  const defaultSummary = reviewText.length > 80 ? `${reviewText.slice(0, 80)}...` : reviewText;

  const combined = {
    summary: groq?.summary || `Executive Summary: Guest feedback regarding ${themes.join(', ')}.`,
    sentiment: { label: verdictSentiment, confidence: verdictConfidence },
    emotion:   { label: verdictEmotion,   confidence: groq?.status === 'success' ? groq.emotion.confidence : (hf?.emotion?.confidence || 75) },
    modelsAgree: agreement,
    detectedThemes: groq?.detectedThemes || themes,
    keyIssues: groq?.keyIssues || [],
    recommendations: groq?.recommendations || [],
    businessInsight: groq?.businessInsight || '',
    managementResponse: verdictResponse,
    emotionEmoji: EMOTION_EMOJI[verdictEmotion] || '😐',
    enginesUsed: [
      ...(groq?.status === 'success' ? ['groq-llama3'] : []),
      ...(hf?.status   === 'success' ? ['huggingface'] : []),
    ],
  };

  return { groq, huggingface: hf, combined, analyzedText: reviewText, guestName: name };
}

module.exports = { runDualAnalysis, detectThemes, buildTemplateResponse };
