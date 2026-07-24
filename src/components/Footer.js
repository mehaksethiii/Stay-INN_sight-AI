import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-custom" style={{ background: 'linear-gradient(135deg, #3e2410 0%, #2c1810 100%)', color: '#c9a882', padding: '3.5rem 2rem 2rem' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4 mb-3">
            <div className="footer-brand mb-2" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f5ede0' }}>
              🏨 INN Sight AI
            </div>
            <p style={{ fontSize: '0.9rem', color: '#a08060', lineHeight: 1.7 }}>
              An intelligent guest review classifier platform powered by dual AI models (Groq LLaMA 3.1 &amp; HuggingFace). Helping homestays and hotels understand guest sentiment in real-time.
            </p>
          </div>

          <div className="col-md-3 col-6 mb-3">
            <h6 style={{ color: '#f5ede0', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Pages</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" className="footer-link">🏠 Home</Link>
              <Link to="/about" className="footer-link">ℹ️ About Us</Link>
              <Link to="/dashboard" className="footer-link">📊 Dashboard</Link>
              <Link to="/ai-analyser" className="footer-link">🤖 AI Analyser</Link>
              <Link to="/login" className="footer-link">🔐 Login / Register</Link>
            </div>
          </div>

          <div className="col-md-3 col-6 mb-3">
            <h6 style={{ color: '#f5ede0', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Features</h6>
            <div className="d-flex flex-column gap-2" style={{ fontSize: '0.9rem', color: '#a08060' }}>
              <span>• AI Sentiment Analysis</span>
              <span>• Emotion &amp; Theme Classifier</span>
              <span>• Auto Management Responses</span>
              <span>• Domain AI Assistant Chatbot</span>
            </div>
          </div>

          <div className="col-md-2 mb-3">
            <h6 style={{ color: '#f5ede0', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '0.5px' }}>Connect</h6>
            <div className="d-flex flex-column gap-2">
              <a href="https://github.com/mehaksethiii/Stay-INN_sight-AI" target="_blank" rel="noopener noreferrer" className="footer-link">🐙 GitHub Repo</a>
              <a href="https://www.linkedin.com/in/mehak-sethi-946335322" target="_blank" rel="noopener noreferrer" className="footer-link">💼 LinkedIn Profile</a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" style={{ borderColor: '#5a3020', margin: '2rem 0 1.5rem' }} />
        <p className="footer-copy" style={{ textAlign: 'center', color: '#7a5040', fontSize: '0.85rem', margin: 0 }}>
          © 2026 INN Sight AI. All rights reserved. Built with ❤️ for Trishul Eco-Homestays.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
