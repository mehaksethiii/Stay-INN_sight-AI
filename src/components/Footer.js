import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-4 mb-4">
            <div className="footer-brand mb-2">INN Sight AI</div>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.7' }}>
              A smart guest review classifier system powered by AI. Helping homestays understand their guests better.
            </p>
          </div>
          <div className="col-md-2 mb-4">
            <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '1rem' }}>Pages</h6>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
          <div className="col-md-3 mb-4">
            <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '1rem' }}>Features</h6>
            <span className="footer-link">Sentiment Analysis</span>
            <span className="footer-link">Theme Detection</span>
            <span className="footer-link">Auto Responses</span>
            <span className="footer-link">Batch Processing</span>
          </div>
          <div className="col-md-3 mb-4">
            <h6 style={{ color: '#fff', fontWeight: '700', marginBottom: '1rem' }}>Connect</h6>
            <a href="#twitter" className="footer-link">🐦 Twitter</a>
            <a href="#instagram" className="footer-link">📸 Instagram</a>
            <a href="#linkedin" className="footer-link">💼 LinkedIn</a>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copy">© 2025 INN Sight AI. All rights reserved. Built with ❤️ for Trishul Eco-Homestays.</p>
      </div>
    </footer>
  );
}

export default Footer;
