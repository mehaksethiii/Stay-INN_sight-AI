import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

const images = ['/home_page.png', '/hotel_room.png'];

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Google login failed.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''));
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const body = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Authentication failed.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to connect to server. Make sure the backend is running.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
    border: '1px solid #e8d5bc', background: '#fef9f4',
    color: '#3e2410', fontSize: '0.95rem', outline: 'none',
    marginBottom: '1rem',
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

      {/* Slideshow background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${images[current]})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.55)',
        transform: 'scale(1.03)',
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        zIndex: 0,
      }} />

      {/* Warm overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(40,20,8,0.5) 0%, rgba(107,63,32,0.35) 100%)',
        zIndex: 1,
      }} />

      {/* Login card */}
      <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px', margin: '1rem', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏨</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410', margin: 0 }}>
            INN Sight AI
          </h2>
          <p style={{ color: '#9e7b60', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '10px',
            border: '1px solid #e8d5bc', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem',
            fontWeight: 600, color: '#3e2410', marginBottom: '1.5rem',
            transition: 'all 0.2s',
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px' }} />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <hr style={{ flex: 1, borderColor: '#e8d5bc' }} />
          <span style={{ color: '#9e7b60', fontSize: '0.85rem' }}>or</span>
          <hr style={{ flex: 1, borderColor: '#e8d5bc' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth}>
          {isSignup && (
            <input
              style={inputStyle}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            style={inputStyle}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && (
            <div style={{ background: '#fce4ec', color: '#c62828', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem',
              background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle signup/login */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9e7b60', fontSize: '0.9rem' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#c8845a', fontWeight: 700, cursor: 'pointer', marginLeft: '0.3rem' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
export default Login;
