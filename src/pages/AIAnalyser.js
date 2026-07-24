import React, { useState } from 'react';
import { API_URL, getAuthHeaders } from '../utils/api';

const EMOTION_EMOJI = { joy:'😊', anger:'😠', sadness:'😢', fear:'😨', disgust:'🤢', surprise:'😲', neutral:'😐' };
const SENTIMENT_COLORS = {
  positive: { bg:'#e8f5e9', color:'#2e7d32', border:'#43a047' },
  negative:  { bg:'#fce4ec', color:'#c62828', border:'#e53935' },
  neutral:   { bg:'#fff8e1', color:'#f57f17', border:'#ffa726' },
};
const THEME_ICONS = { cleanliness:'🧹', food:'🍽️', staff:'👤', location:'📍', comfort:'🛏️', value:'💰', 'general experience':'⭐' };

const EXAMPLES = [
  'The room was spotless and the staff was incredibly warm and welcoming. Breakfast was delicious!',
  'Disgusting bathrooms, rude staff, and the food was stale. I want a refund.',
  'Average stay. Location was convenient but the room was a bit noisy at night.',
];

/* ── Loading skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ padding:'2rem', background:'rgba(255,255,255,0.97)', borderRadius:'20px', border:'1px solid #e8d5bc' }}>
      {[100,70,85,55,90].map((w,i)=>(
        <div key={i} style={{ height:13, background:'linear-gradient(90deg,#f5ede0 25%,#e8d5bc 50%,#f5ede0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite', borderRadius:6, width:`${w}%`, marginBottom:'1rem' }} />
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function AIAnalyser() {
  const [reviewText, setReviewText] = useState('');
  const [guestName,  setGuestName]  = useState('');
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);

  const handleAnalyse = async (e) => {
    if (e) e.preventDefault();
    if (reviewText.trim().length < 10) { setError('Please enter at least 10 characters.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch(`${API_URL}/api/ai/analyse`, {
        method:'POST', headers:getAuthHeaders(),
        body: JSON.stringify({ reviewText:reviewText.trim(), guestName:guestName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Analysis failed. Please try again.'); return; }
      setResult(data.data);
    } catch {
      setError('Cannot connect to the backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (!result?.combined?.managementResponse) return;
    navigator.clipboard.writeText(result.combined.managementResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const combined  = result?.combined;
  const sc        = combined ? (SENTIMENT_COLORS[combined.sentiment?.label] || SENTIMENT_COLORS.neutral) : null;

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#fef9f4 0%,#f5ede0 100%)', padding:'2rem 1rem' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth:780, margin:'0 auto' }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🤖</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:'#3e2410', fontSize:'2.3rem', margin:0 }}>
            AI Review Analyser &amp; Summarizer
          </h1>
          <p style={{ color:'#9e7b60', marginTop:'0.5rem', fontSize:'0.95rem' }}>
            Powered by Groq · LLaMA 3.1 — instant 1-sentence summaries, sentiment classification &amp; management responses
          </p>
        </div>

        {/* ── Input Form ───────────────────────────────────────────────── */}
        <div style={{ background:'rgba(255,255,255,0.97)', borderRadius:'24px', padding:'2.2rem', boxShadow:'0 10px 40px rgba(62,36,16,0.1)', border:'1px solid #e8d5bc', marginBottom:'2rem' }}>
          <h5 style={{ color:'#3e2410', fontWeight:800, marginBottom:'1.5rem', fontFamily:"'Playfair Display',serif" }}>📝 Enter Guest Review</h5>
          <form onSubmit={handleAnalyse}>
            
            {/* Guest Name Field */}
            <div style={{ marginBottom:'1.2rem' }}>
              <label style={{ color:'#6b4c35', fontWeight:700, fontSize:'0.85rem', display:'block', marginBottom:'0.4rem' }}>
                Guest Name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={guestName}
                onChange={e=>setGuestName(e.target.value)}
                style={{ width:'100%', padding:'0.7rem 1.1rem', borderRadius:'12px', border:'1px solid #e8d5bc', background:'#fef9f4', color:'#3e2410', fontSize:'0.92rem', outline:'none', boxSizing:'border-box' }}
              />
            </div>

            {/* Review Text Textarea - Big, Multiline & Prominent */}
            <div style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                <label style={{ color:'#6b4c35', fontWeight:700, fontSize:'0.85rem' }}>
                  Review Text <span style={{ color:'#c62828' }}>*</span>
                </label>
                <span style={{ fontSize:'0.78rem', color:'#9e7b60', fontWeight:600 }}>
                  {reviewText.length} characters
                </span>
              </div>
              <textarea
                placeholder="Paste or type long guest reviews here... (e.g. detailed experience about room, staff, food, cleanliness, or stay comfort)"
                value={reviewText}
                onChange={e=>setReviewText(e.target.value)}
                rows={5}
                style={{
                  width:'100%',
                  padding:'0.9rem 1.1rem',
                  borderRadius:'14px',
                  border:'1.5px solid #e8d5bc',
                  background:'#fef9f4',
                  color:'#3e2410',
                  fontSize:'0.95rem',
                  lineHeight:1.6,
                  outline:'none',
                  boxSizing:'border-box',
                  minHeight:'140px',
                  resize:'vertical',
                  boxShadow:'inset 0 2px 5px rgba(0,0,0,0.03)'
                }}
              />
            </div>

            {/* Example buttons */}
            <div style={{ marginBottom:'1.5rem', background:'#fef9f4', padding:'0.75rem 1rem', borderRadius:'12px', border:'1px solid #e8d5bc' }}>
              <span style={{ color:'#9e7b60', fontSize:'0.8rem', fontWeight:700, display:'block', marginBottom:'0.35rem' }}>💡 Quick Examples: </span>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                {EXAMPLES.map((ex,i) => (
                  <button key={i} type="button" onClick={()=>{ setReviewText(ex); setResult(null); setError(''); }}
                    style={{ background:'#f5ede0', border:'1px solid #e8d5bc', borderRadius:'15px', padding:'0.3rem 0.85rem', fontSize:'0.76rem', color:'#6b3f20', cursor:'pointer', fontWeight:600 }}>
                    Example {i+1} ({ex.slice(0, 30)}...)
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background:'#fce4ec', color:'#c62828', padding:'0.75rem 1rem', borderRadius:'12px', fontSize:'0.88rem', marginBottom:'1.2rem', display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
              <button type="submit" disabled={loading}
                style={{ background: loading ? '#d7b99a' : 'linear-gradient(135deg,#c8845a,#6b3f20)', color:'#fff', border:'none', padding:'0.8rem 2.4rem', borderRadius:'25px', fontWeight:700, cursor: loading?'not-allowed':'pointer', fontSize:'0.95rem', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'0.6rem', boxShadow:'0 4px 15px rgba(107,63,32,0.2)' }}>
                {loading
                  ? <><span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.4)',borderTop:'2px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite' }} /> Processing...</>
                  : '🔍 Full AI Analysis & Verdict'}
              </button>

              <button type="button" onClick={handleAnalyse} disabled={loading}
                style={{ background: '#f5ede0', color: '#6b3f20', border: '1.5px solid #e8d5bc', padding: '0.8rem 2rem', borderRadius: '25px', fontWeight: 700, cursor: loading?'not-allowed':'pointer', fontSize: '0.95rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚡ Summarize Review
              </button>
            </div>
          </form>
        </div>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            <div style={{ textAlign:'center', padding:'1.5rem', background:'rgba(255,255,255,0.95)', borderRadius:'16px', marginBottom:'1.5rem', border:'1px solid #e8d5bc' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.5rem', animation:'pulse 1.2s infinite' }}>🤖</div>
              <p style={{ color:'#6b4c35', margin:0, fontWeight:600 }}>AI is summarizing and analyzing the review...</p>
            </div>
            <Skeleton />
          </div>
        )}

        {/* ── Result: Final AI Verdict & Summary ─────────────────────────── */}
        {combined && !loading && (
          <div style={{ animation:'fadeIn 0.5s ease' }}>

            {/* AI Executive Summary Card */}
            {combined.summary && (
              <div style={{ background:'linear-gradient(135deg,#fff8e1,#fef9f4)', border:'2px solid #ffa726', borderRadius:'18px', padding:'1.4rem 1.7rem', marginBottom:'1.5rem', boxShadow:'0 6px 25px rgba(255,167,38,0.18)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.4rem' }}>
                  <span style={{ fontSize:'1.4rem' }}>📌</span>
                  <h6 style={{ color:'#b26a00', fontWeight:800, margin:0, textTransform:'uppercase', letterSpacing:'0.5px', fontSize:'0.85rem' }}>
                    Executive Review Summary
                  </h6>
                </div>
                <p style={{ fontSize:'1.05rem', color:'#3e2410', fontWeight:700, margin:0, lineHeight:1.6 }}>
                  "{combined.summary}"
                </p>
              </div>
            )}

            {/* Sentiment Banner */}
            <div style={{ background:sc.bg, border:`2px solid ${sc.border}`, borderRadius:'16px', padding:'1.2rem 1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
              <div style={{ fontSize:'2.5rem' }}>
                {combined.sentiment?.label === 'positive' ? '😊' : combined.sentiment?.label === 'negative' ? '😞' : '😐'}
              </div>
              <div>
                <div style={{ fontSize:'0.75rem', color:sc.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>Overall Sentiment</div>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color:sc.color, textTransform:'capitalize', lineHeight:1.2 }}>
                  {combined.sentiment?.label}
                </div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.3rem' }}>
                <span style={{ background:sc.color, color:'#fff', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.82rem', fontWeight:700 }}>
                  {combined.sentiment?.confidence}% confidence
                </span>
                <span style={{ fontSize:'0.78rem', color:sc.color, fontWeight:600 }}>
                  {EMOTION_EMOJI[combined.emotion?.label] || '😐'} Emotion: {combined.emotion?.label} ({combined.emotion?.confidence}%)
                </span>
              </div>
            </div>

            {/* Themes */}
            {combined.detectedThemes?.length > 0 && (
              <div style={{ marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#6b4c35', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>🏷️ Detected Themes</div>
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  {combined.detectedThemes.map(th => (
                    <span key={th} style={{ padding:'0.3rem 0.9rem', background:`${sc.border}18`, border:`1px solid ${sc.border}55`, borderRadius:'20px', fontSize:'0.82rem', fontWeight:700, color:'#3e2410', textTransform:'capitalize' }}>
                      {THEME_ICONS[th]||'🔸'} {th}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Issues (negative only) */}
            {combined.keyIssues?.length > 0 && combined.sentiment?.label === 'negative' && (
              <div style={{ background:'#fff8e1', border:'1px solid #ffa72644', borderRadius:'14px', padding:'1.2rem 1.5rem', marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#f57f17', marginBottom:'0.5rem', textTransform:'uppercase' }}>⚠️ Issues Identified</div>
                {combined.keyIssues.map((issue,i) => (
                  <div key={i} style={{ fontSize:'0.88rem', color:'#3e2410', padding:'0.2rem 0', borderBottom:i<combined.keyIssues.length-1?'1px dashed #e8d5bc':'none' }}>
                    • {issue}
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {combined.recommendations?.length > 0 && (
              <div style={{ background:'#e8f5e9', border:'1px solid #43a04744', borderRadius:'14px', padding:'1.2rem 1.5rem', marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#2e7d32', marginBottom:'0.5rem', textTransform:'uppercase' }}>💡 Recommendations</div>
                {combined.recommendations.map((rec,i) => (
                  <div key={i} style={{ fontSize:'0.88rem', color:'#3e2410', padding:'0.2rem 0' }}>→ {rec}</div>
                ))}
              </div>
            )}

            {/* Business Insight */}
            {combined.businessInsight && (
              <div style={{ background:'linear-gradient(135deg,#fef9f4,#f5ede0)', borderRadius:'14px', padding:'1.2rem 1.5rem', marginBottom:'1.5rem', borderLeft:'4px solid #c8845a' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#c8845a', marginBottom:'0.4rem', textTransform:'uppercase' }}>📈 Business Insight</div>
                <p style={{ fontSize:'0.9rem', color:'#3e2410', margin:0, lineHeight:1.6, fontStyle:'italic' }}>{combined.businessInsight}</p>
              </div>
            )}

            {/* Management Response */}
            <div style={{ background:'linear-gradient(135deg,#3e2410,#6b3f20)', borderRadius:'20px', padding:'1.8rem 2rem', boxShadow:'0 8px 30px rgba(62,36,16,0.25)', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <span style={{ fontSize:'1.5rem' }}>✨</span>
                <h6 style={{ color:'#f5ede0', fontWeight:800, margin:0, fontSize:'1rem' }}>AI-Generated Management Response</h6>
                <span style={{ marginLeft:'auto', fontSize:'0.7rem', background:'rgba(200,132,90,0.3)', color:'#f5c842', padding:'0.2rem 0.6rem', borderRadius:'10px', fontWeight:700 }}>
                  via {combined.enginesUsed?.[0] || 'ai'}
                </span>
              </div>
              <p style={{ color:'#fef9f4', fontSize:'0.95rem', margin:'0 0 1rem', fontStyle:'italic', lineHeight:1.75, borderLeft:'3px solid #c8845a', paddingLeft:'1rem' }}>
                "{combined.managementResponse}"
              </p>
              <button onClick={copyResponse}
                style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.3)', color:'#f5ede0', padding:'0.4rem 1.2rem', borderRadius:'15px', fontSize:'0.8rem', cursor:'pointer', fontWeight:600, transition:'all 0.2s' }}>
                {copied ? '✅ Copied!' : '📋 Copy Response'}
              </button>
            </div>

            {/* Analyse again */}
            <div style={{ textAlign:'center', paddingBottom:'1rem' }}>
              <button onClick={()=>{ setResult(null); setReviewText(''); setGuestName(''); setError(''); }}
                style={{ background:'none', border:'2px solid #c8845a', color:'#c8845a', padding:'0.6rem 2rem', borderRadius:'25px', fontWeight:700, cursor:'pointer', fontSize:'0.9rem' }}>
                🔄 Analyse Another Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
