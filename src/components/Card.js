import React, { useState } from 'react';

function Card({ title, description, image, action, sentiment }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const sentimentClass = {
    positive: 'sentiment-positive',
    neutral: 'sentiment-neutral',
    negative: 'sentiment-negative',
  }[sentiment] || 'sentiment-positive';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 deg)
    const rotateX = ((y / rect.height) - 0.5) * -16;
    const rotateY = ((x / rect.width) - 0.5) * 16;
    
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlowPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #fef9f4 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(62, 36, 16, 0.1)',
        border: '1px solid #e8d5bc',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        transform: transform,
        transformStyle: 'preserve-3d',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Dynamic Specular Radial Light Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(200, 132, 90, 0.15) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {image && (
        <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#3e2410', position: 'relative' }}>
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              transition: 'transform 0.5s ease',
              filter: 'brightness(0.96)'
            }}
          />
        </div>
      )}

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
        <div>
          {sentiment && (
            <span className={`sentiment-badge ${sentimentClass}`} style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
              {sentiment === 'positive' ? '😊 Positive' : sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
            </span>
          )}
          <h5 style={{ color: '#3e2410', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.6rem', fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h5>
          <p style={{ color: '#6b4c35', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {description}
          </p>
        </div>

        {action && (
          <button
            className="card-btn"
            onClick={action.onClick}
            style={{
              background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              boxShadow: '0 4px 15px rgba(200, 132, 90, 0.3)'
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
