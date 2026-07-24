import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { API_URL, getAuthHeaders } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/* ── Simple markdown renderer ─────────────────────────────────────────────── */
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#f5ede0;padding:0.1rem 0.3rem;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/^### (.+)$/gm, '<h6 style="margin:0.5rem 0 0.25rem;font-weight:700">$1</h6>')
    .replace(/^## (.+)$/gm,  '<h5 style="margin:0.5rem 0 0.25rem;font-weight:700">$1</h5>')
    .replace(/^# (.+)$/gm,   '<h4 style="margin:0.5rem 0 0.25rem;font-weight:700">$1</h4>')
    .replace(/^- (.+)$/gm,   '<div style="padding-left:1rem">• $1</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

/* ── Typing indicator ─────────────────────────────────────────────────────── */
const TypingIndicator = memo(() => (
  <div style={{ display:'flex', gap:'4px', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.95)', borderRadius:'12px 12px 12px 4px', width:'fit-content', boxShadow:'0 2px 8px rgba(62,36,16,0.1)' }}>
    {[0,1,2].map(i => (
      <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#c8845a', display:'inline-block', animation:`bounce 1s ${i*0.2}s infinite` }} />
    ))}
  </div>
));

/* ── Message bubble ───────────────────────────────────────────────────────── */
const MessageBubble = memo(({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom:'0.75rem' }}>
      {!isUser && <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c8845a,#6b3f20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem', marginRight:'0.5rem', flexShrink:0, alignSelf:'flex-end' }}>🤖</div>}
      <div style={{
        maxWidth:'80%', padding:'0.75rem 1rem',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'linear-gradient(135deg,#c8845a,#6b3f20)' : 'rgba(255,255,255,0.97)',
        color: isUser ? '#fff' : '#3e2410', fontSize:'0.9rem', lineHeight:1.55,
        boxShadow:'0 3px 10px rgba(62,36,16,0.12)',
      }}
        dangerouslySetInnerHTML={{ __html: isUser ? msg.content : renderMarkdown(msg.content) }}
      />
    </div>
  );
});

const SUGGESTED = [
  'How do I use this website?',
  'What does the AI Analyser do?',
  'How is sentiment detected?',
  'Explain the Dashboard',
  'What is INN Sight AI?',
];

/* ══ FloatingChatbot ══════════════════════════════════════════════════════════ */
export default function FloatingChatbot() {
  const { isAuthenticated } = useAuth();

  const [open,      setOpen]      = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [messages,  setMessages]  = useState([
    { role:'assistant', content:"Hi! 👋 I'm the **INN Sight AI** assistant. Ask me anything about the platform, reviews, or AI analysis!" }
  ]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const [error,  setError]  = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { if (!minimized) bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing, minimized]);
  useEffect(() => { if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300); }, [open, minimized]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setError('');
    setMinimized(false);

    const userMsg = { role:'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    try {
      const res  = await fetch(`${API_URL}/api/ai/chat`, {
        method:'POST', headers:getAuthHeaders(),
        body: JSON.stringify({ message: msg, history: messages.slice(-8) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to get response.'); setTyping(false); return; }
      setMessages(prev => [...prev, { role:'assistant', content: data.response }]);
    } catch {
      setError('Cannot reach chatbot. Make sure the backend is running.');
    } finally {
      setTyping(false);
    }
  }, [input, messages]);

  const clearChat = () => setMessages([{ role:'assistant', content:'Chat cleared! How can I help you? 😊' }]);
  const handleClose    = () => { setOpen(false); setMinimized(false); setMaximized(false); };
  const handleMinimize = () => setMinimized(m => !m);
  const handleMaximize = () => setMaximized(m => !m);
  const handleOpen     = () => { setOpen(true); setMinimized(false); };

  if (!isAuthenticated) return null;

  // ── Increased dynamic window dimensions ──
  const winWidth  = maximized ? Math.min(720, window.innerWidth - 32) : 400;
  const winHeight = minimized ? 'auto' : maximized ? Math.min(650, window.innerHeight - 160) : 560;

  return (
    <>
      <style>{`
        @keyframes bounce   { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse2   { 0%,100%{box-shadow:0 0 0 0 rgba(200,132,90,0.5)} 70%{box-shadow:0 0 0 15px rgba(200,132,90,0)} }
        .chat-input:focus   { outline:none; border-color:#c8845a !important; }
        .chat-send:hover    { background:linear-gradient(135deg,#a0663c,#4a2510) !important; }
        .suggest-btn:hover  { background:#f5ede0 !important; }
        .win-btn:hover      { opacity:1 !important; transform:scale(1.15); }
      `}</style>

      {/* ── Larger Floating Button + Badge ─────────────────────────────── */}
      <div style={{ position:'fixed', bottom:'2rem', right:'2.2rem', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' }}>
        <button
          onClick={open ? handleClose : handleOpen}
          aria-label="Open AI chatbot"
          style={{
            width:68, height:68, borderRadius:'50%', border:'none', cursor:'pointer',
            background:'linear-gradient(135deg, #d88e63, #5a3015)',
            color:'#fff', fontSize:'2rem', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 6px 25px rgba(62,36,16,0.4)',
            animation: open ? 'none' : 'pulse2 2s infinite',
            transition:'transform 0.25s ease, box-shadow 0.25s ease',
            transform: open ? 'rotate(45deg) scale(1.08)' : 'none',
          }}
        >
          {open ? '✕' : '💬'}
        </button>

        {/* Larger Prominent Label Badge below button */}
        <span style={{
          fontSize:'0.75rem', fontWeight:800, color:'#4a260f',
          background:'linear-gradient(135deg, #fef9f4, #f5ede0)', padding:'0.25rem 0.85rem',
          borderRadius:'12px', border:'1px solid #c8845a',
          whiteSpace:'nowrap', letterSpacing:'0.4px',
          boxShadow:'0 3px 10px rgba(62,36,16,0.15)',
          pointerEvents:'none',
        }}>
          🤖 INN Sight AI Chatbot
        </span>

        {/* Unread dot */}
        {!open && (
          <span style={{ position:'absolute', top:2, right:2, width:14, height:14, borderRadius:'50%', background:'#e53935', border:'2px solid #fff' }} />
        )}
      </div>

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position:'fixed',
          bottom:'calc(2rem + 100px)',
          right:'2.2rem',
          zIndex:9998,
          width: winWidth,
          maxWidth:'calc(100vw - 2.5rem)',
          height: winHeight,
          borderRadius:'24px',
          overflow:'hidden',
          boxShadow:'0 25px 70px rgba(62,36,16,0.3)',
          animation:'slideUp 0.3s ease',
          display:'flex',
          flexDirection:'column',
          border:'1.5px solid #e8d5bc',
          transition:'width 0.25s ease, height 0.25s ease',
        }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#3e2410,#6b3f20)', padding:'0.95rem 1.2rem', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0, userSelect:'none' }}>

            <div style={{ display:'flex', gap:'7px', marginRight:'0.3rem' }}>
              <button className="win-btn" onClick={handleClose} title="Close"
                style={{ width:14, height:14, borderRadius:'50%', background:'#ff5f56', border:'none', cursor:'pointer', opacity:0.85, transition:'all 0.15s', padding:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color:'transparent' }}
                onMouseEnter={e => e.target.style.color='#8b0000'}
                onMouseLeave={e => e.target.style.color='transparent'}
              >✕</button>

              <button className="win-btn" onClick={handleMinimize} title={minimized ? 'Restore' : 'Minimize'}
                style={{ width:14, height:14, borderRadius:'50%', background:'#ffbd2e', border:'none', cursor:'pointer', opacity:0.85, transition:'all 0.15s', padding:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color:'transparent' }}
                onMouseEnter={e => e.target.style.color='#7d5200'}
                onMouseLeave={e => e.target.style.color='transparent'}
              >−</button>

              <button className="win-btn" onClick={handleMaximize} title={maximized ? 'Restore size' : 'Maximize'}
                style={{ width:14, height:14, borderRadius:'50%', background:'#28ca41', border:'none', cursor:'pointer', opacity:0.85, transition:'all 0.15s', padding:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color:'transparent' }}
                onMouseEnter={e => e.target.style.color='#014d00'}
                onMouseLeave={e => e.target.style.color='transparent'}
              >⤢</button>
            </div>

            <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>🤖</div>
            <div>
              <div style={{ color:'#f5ede0', fontWeight:800, fontSize:'0.95rem', lineHeight:1.2 }}>INN Sight AI Chatbot</div>
              <div style={{ color:'#c8845a', fontSize:'0.72rem' }}>Powered by Groq · LLaMA 3.1</div>
            </div>

            <button onClick={clearChat} title="Clear chat"
              style={{ marginLeft:'auto', background:'rgba(255,255,255,0.12)', border:'none', color:'#f5ede0', borderRadius:'8px', padding:'0.3rem 0.65rem', cursor:'pointer', fontSize:'0.72rem', fontWeight:600 }}>
              🗑 Clear
            </button>
          </div>

          {!minimized && (
            <>
              <div style={{ flex:1, overflowY:'auto', padding:'1.1rem', background:'linear-gradient(180deg,#fef9f4,#f9f0e6)' }}>
                {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
                {typing && <TypingIndicator />}
                {error && <div style={{ background:'#fce4ec', color:'#c62828', padding:'0.6rem 0.85rem', borderRadius:'12px', fontSize:'0.85rem', marginTop:'0.5rem' }}>⚠️ {error}</div>}
                <div ref={bottomRef} />
              </div>

              {messages.length <= 2 && (
                <div style={{ padding:'0 1.1rem 0.6rem', background:'#fef9f4', display:'flex', gap:'0.45rem', flexWrap:'wrap' }}>
                  {SUGGESTED.map(s => (
                    <button key={s} className="suggest-btn" onClick={() => sendMessage(s)}
                      style={{ background:'rgba(200,132,90,0.12)', border:'1px solid rgba(200,132,90,0.35)', color:'#6b3f20', borderRadius:'16px', padding:'0.25rem 0.75rem', fontSize:'0.75rem', cursor:'pointer', fontWeight:600, transition:'background 0.2s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ padding:'0.85rem 1.1rem', background:'rgba(255,255,255,0.97)', borderTop:'1px solid #e8d5bc', display:'flex', gap:'0.6rem', flexShrink:0 }}>
                <input
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !typing) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask me anything..."
                  disabled={typing}
                  style={{ flex:1, padding:'0.7rem 1.1rem', borderRadius:'25px', border:'1.5px solid #e8d5bc', background:'#fef9f4', color:'#3e2410', fontSize:'0.9rem', transition:'border-color 0.2s' }}
                />
                <button
                  className="chat-send"
                  onClick={() => sendMessage()}
                  disabled={typing || !input.trim()}
                  style={{ background:'linear-gradient(135deg,#c8845a,#6b3f20)', border:'none', color:'#fff', borderRadius:'50%', width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor: typing||!input.trim() ? 'not-allowed':'pointer', opacity: typing||!input.trim() ? 0.5:1, fontSize:'1.1rem', transition:'all 0.2s', flexShrink:0 }}>
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
