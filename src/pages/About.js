import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fef9f4 0%, #f5ede0 100%)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(200, 132, 90, 0.15)',
            border: '1px solid rgba(200, 132, 90, 0.4)',
            borderRadius: '20px',
            padding: '0.35rem 1.2rem',
            fontSize: '0.85rem',
            color: '#c8845a',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            🏨 ABOUT INN SIGHT AI
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
            Empowering Homestays &amp; Hotels with AI Intelligence
          </h1>
          <p style={{ color: '#6b4c35', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            INN Sight AI is an intelligent guest review classification system that automatically identifies guest satisfaction levels, detects recurring service issues, categorizes themes, and generates actionable, AI-powered management responses.
          </p>
        </div>

        {/* Mission Statement Box */}
        <div style={{
          background: 'linear-gradient(135deg, #3e2410, #6b3f20)',
          borderRadius: '24px',
          padding: '2.5rem',
          color: '#f5ede0',
          boxShadow: '0 12px 40px rgba(62,36,16,0.2)',
          marginBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f5ede0', marginBottom: '1rem' }}>
              🎯 Our Mission
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#fef9f4', margin: 0 }}>
              Hospitality managers receive hundreds of unstructured feedback comments weekly across various booking channels. 
              INN Sight AI bridges the gap between raw guest comments and operational decision-making by serving as a real-time 
              intelligence engine that converts reviews into instant metrics, operational recommendations, and empathetic guest replies.
            </p>
          </div>
        </div>

        {/* Architecture & Tech Stack Grid */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410', fontSize: '2rem' }}>
              ⚡ Powered By Production-Grade AI Architecture
            </h2>
            <p style={{ color: '#9e7b60', fontSize: '0.95rem' }}>Multi-layer model fallbacks designed for zero downtime and ultra-low latency</p>
          </div>

          <div className="row g-4 align-items-stretch">
            <div className="col-md-4">
              <Card
                title="⚡ Groq LLaMA 3.1"
                description="Ultra-fast LLaMA 3.1 inference engine for deep review reasoning, theme extraction, and professional response generation."
                sentiment="positive"
              />
            </div>
            <div className="col-md-4">
              <Card
                title="🤗 HuggingFace RoBERTa"
                description="RoBERTa transformer models fine-tuned on hospitality datasets for precision sentiment &amp; emotion breakdown scores."
                sentiment="positive"
              />
            </div>
            <div className="col-md-4">
              <Card
                title="🍃 MongoDB &amp; Express"
                description="Secure REST API infrastructure backed by MongoDB Atlas for real-time review persistence and JWT-authenticated routes."
                sentiment="neutral"
              />
            </div>
          </div>
        </div>

        {/* Core Capabilities */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e8d5bc',
          boxShadow: '0 8px 30px rgba(62,36,16,0.08)',
          marginBottom: '3rem'
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410', marginBottom: '1.5rem', textAlign: 'center' }}>
            ✨ Core System Capabilities
          </h3>
          <div className="row g-4">
            <div className="col-md-6">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem' }}>😊</div>
                <div>
                  <h6 style={{ color: '#3e2410', fontWeight: 800, margin: '0 0 0.3rem 0' }}>Automated Sentiment Analysis</h6>
                  <p style={{ color: '#6b4c35', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    Classifies guest reviews into Positive, Neutral, or Negative sentiment categories instantly upon submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem' }}>🏷️</div>
                <div>
                  <h6 style={{ color: '#3e2410', fontWeight: 800, margin: '0 0 0.3rem 0' }}>Theme &amp; Category Detection</h6>
                  <p style={{ color: '#6b4c35', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    Identifies whether feedback relates to cleanliness, food, staff, location, value, or overall stay comfort.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem' }}>💡</div>
                <div>
                  <h6 style={{ color: '#3e2410', fontWeight: 800, margin: '0 0 0.3rem 0' }}>Actionable Insights &amp; Recommendations</h6>
                  <p style={{ color: '#6b4c35', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    Extracts recurring issues and generates operational business recommendations for homestay hosts.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem' }}>💬</div>
                <div>
                  <h6 style={{ color: '#3e2410', fontWeight: 800, margin: '0 0 0.3rem 0' }}>Domain AI Chatbot Assistant</h6>
                  <p style={{ color: '#6b4c35', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    An interactive floating AI assistant available across the application to answer platform and review questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/ai-analyser')}
            style={{
              background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff',
              border: 'none',
              padding: '0.8rem 2.5rem',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(107,63,32,0.25)'
            }}
          >
            🚀 Try AI Review Analyser Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default About;
