import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="row">
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Reviews Analysed</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Sentiment Classes</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <div className="stat-number">Real-time</div>
                <div className="stat-label">AI Processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container my-5 py-3">
        <div className="text-center mb-5">
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            What INN Sight AI Does
          </h2>
          <p className="section-subtitle">Powerful tools to understand your guest feedback instantly</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <div className="feature-title">Sentiment Classification</div>
              <p className="feature-desc">Automatically classifies each review as positive, neutral, or negative using advanced AI.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <div className="feature-title">Theme Detection</div>
              <p className="feature-desc">Identifies the primary theme — food, host, location, cleanliness, value, or experience.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-title">Auto Responses</div>
              <p className="feature-desc">Generates a one-line management response suggestion for every review automatically.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reviews Section with 3D Tilt Cards */}
      <div className="container my-5 py-3">
        <div className="text-center mb-5">
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Featured Guest Reviews
          </h2>
          <p className="section-subtitle">Interactive 3D Cards — Move your mouse over any card to experience real-time tilt &amp; specular lighting</p>
        </div>
        <div className="row g-4 align-items-stretch">
          <div className="col-md-4">
            <Card
              title="Hotel Room Review"
              description="Great location and friendly staff. The room was spotless, clean, and well maintained. Would definitely visit again!"
              image="/hotel.png"
              sentiment="positive"
              action={{ label: "🔍 View AI Analysis", onClick: () => navigate('/ai-analyser') }}
            />
          </div>
          <div className="col-md-4">
            <Card
              title="Guest Service Experience"
              description="Comfortable rooms and excellent service. The host was very welcoming, friendly, and helpful throughout our stay."
              image="/guestexperience.png"
              sentiment="positive"
              action={{ label: "🔍 View AI Analysis", onClick: () => navigate('/ai-analyser') }}
            />
          </div>
          <div className="col-md-4">
            <Card
              title="Rooftop Dining Review"
              description="Amazing breakfast and rooftop dining experience. The food quality was great but service was a bit slow."
              image="/diningreview.png"
              sentiment="neutral"
              action={{ label: "🔍 View AI Analysis", onClick: () => navigate('/ai-analyser') }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
