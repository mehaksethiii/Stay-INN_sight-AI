import React, { useEffect, useState } from 'react';

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

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

  // Smooth spring lag for the follower aura
  useEffect(() => {
    let animationFrameId;
    const follow = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(follow);
    };
    animationFrameId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  return (
    <>
      {/* Large Ambient Glow Aura */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '280px' : '220px',
          height: isHovered ? '280px' : '220px',
          borderRadius: '50%',
          background: isHovered
            ? 'radial-gradient(circle, rgba(200, 132, 90, 0.35) 0%, rgba(107, 63, 32, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(200, 132, 90, 0.22) 0%, rgba(107, 63, 32, 0.08) 45%, transparent 70%)',
          transform: `translate3d(${followerPos.x - (isHovered ? 140 : 110)}px, ${followerPos.y - (isHovered ? 140 : 110)}px, 0)`,
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'screen',
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Inner Precision Cursor Ring/Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '24px' : isMouseDown ? '8px' : '12px',
          height: isHovered ? '24px' : isMouseDown ? '8px' : '12px',
          borderRadius: '50%',
          border: '1.5px solid rgba(200, 132, 90, 0.95)',
          backgroundColor: isHovered ? 'rgba(200, 132, 90, 0.3)' : 'rgba(107, 63, 32, 0.75)',
          boxShadow: '0 0 12px rgba(200, 132, 90, 0.6)',
          transform: `translate3d(${position.x - (isHovered ? 12 : isMouseDown ? 4 : 6)}px, ${position.y - (isHovered ? 12 : isMouseDown ? 4 : 6)}px, 0)`,
          pointerEvents: 'none',
          zIndex: 100000,
          transition: 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}

export default CustomCursor;
