import React, { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {

  // close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // if isOpen is false, show nothing
  if (!isOpen) return null;

  return (
    // backdrop — dark overlay behind modal
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1050
      }}
    >
      {/* modal box — stop click from closing when clicking inside */}
      <div
        className="bg-white rounded p-4"
        style={{ minWidth: '400px', maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
