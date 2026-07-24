import React, { useState, useEffect } from 'react';

const images = ['/home_page.png', '/hotel_room.png'];

function GlobalResortBackground() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // fade in new image
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Slideshow background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images[current]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.45) contrast(1.05)',
          transform: 'scale(1.04)',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* Luxury warm overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(28, 14, 5, 0.75) 0%, rgba(62, 36, 16, 0.65) 50%, rgba(107, 63, 32, 0.55) 100%)',
        }}
      />
    </div>
  );
}

export default GlobalResortBackground;
