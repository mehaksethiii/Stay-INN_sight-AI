import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const images = ['/home_page.png', '/hotel_room.png'];

function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // fade in new image
      }, 800); // fade out duration
    }, 5000); // switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      {/* Slideshow background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${images[current]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.92)',
        transform: 'scale(1.03)',
        zIndex: 0,
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
      }} />

      {/* Warm color overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(160deg, rgba(40,20,8,0.22) 0%, rgba(107,63,32,0.15) 60%, rgba(200,132,90,0.08) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-badge">🏨 AI-Powered Review Intelligence</div>
        <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          Understand Your Guests <br />
          <span>Instantly with AI</span>
        </h1>
        <p className="hero-subtitle">INN Sight AI — Guest Review Classifier</p>
        <p className="hero-desc">
          Classify reviews as positive, neutral, or negative. Detect themes. <br />
          Generate management responses — all in seconds.
        </p>
        <button className="hero-btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        <button className="hero-btn-secondary">Learn More</button>
      </div>
    </section>
  );
}

export default Hero;
