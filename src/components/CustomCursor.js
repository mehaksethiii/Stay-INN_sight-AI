import React, { useEffect, useState, useRef } from 'react';

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const particlesRef = useRef([]);
  const canvasRef = useRef(null);

  // Position tracking & magnetic hover detection
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Spawn antigravity stardust particles
      if (Math.random() < 0.6) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 1.2, // Float upwards (anti-gravity)
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          color: Math.random() > 0.5 ? '#c8845a' : '#f5ede0',
        });
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.onclick ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Smooth magnetic spring physics for outer ring
  useEffect(() => {
    let animId;
    const updateSpring = () => {
      setRingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(updateSpring);
    };
    animId = requestAnimationFrame(updateSpring);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  // Particle Canvas Animation Loop (Anti-Gravity Floating Particles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy; // anti-gravity upward float
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes antityPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99998,
        }}
      />

      {/* Antigravity Floating Magnetic Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 48 : isClicking ? 24 : 36,
          height: isHovered ? 48 : isClicking ? 24 : 36,
          borderRadius: '50%',
          border: isHovered ? '2px solid #c8845a' : '1.5px solid rgba(200, 132, 90, 0.8)',
          backgroundColor: isHovered ? 'rgba(200, 132, 90, 0.15)' : 'rgba(200, 132, 90, 0.05)',
          boxShadow: isHovered ? '0 0 25px rgba(200, 132, 90, 0.6)' : '0 0 12px rgba(200, 132, 90, 0.3)',
          transform: `translate3d(${ringPos.x - (isHovered ? 24 : isClicking ? 12 : 18)}px, ${ringPos.y - (isHovered ? 24 : isClicking ? 12 : 18)}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
          willChange: 'transform',
        }}
      />

      {/* Luminous Antigravity Core Glowing Star Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 8 : 6,
          height: isHovered ? 8 : 6,
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px #fff, 0 0 20px #c8845a, 0 0 30px #c8845a',
          transform: `translate3d(${pos.x - (isHovered ? 4 : 3)}px, ${pos.y - (isHovered ? 4 : 3)}px, 0)`,
          pointerEvents: 'none',
          zIndex: 100000,
          transition: 'width 0.15s ease, height 0.15s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}

export default CustomCursor;
