import React from 'react';

function ConfirmModal({ isOpen, title, message, confirmText = "Delete", cancelText = "Cancel", onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(62, 36, 16, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fef9f4',
        borderRadius: '20px',
        maxWidth: '420px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 20px 50px rgba(62, 36, 16, 0.25)',
        border: '1px solid #e8d5bc',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isDanger ? '🗑️' : '❓'}
        </div>
        <h5 style={{ color: '#3e2410', fontWeight: 800, textAlign: 'center', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h5>
        <p style={{ color: '#6b4c35', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: '#f5ede0',
              color: '#6b3f20',
              border: '1px solid #e8d5bc',
              padding: '0.6rem 1.4rem',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: isDanger ? 'linear-gradient(135deg, #e53935, #c62828)' : 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
