import React from 'react';

function EmptyState({ icon = "💬", title = "No Reviews Found", message = "There are no reviews matching your search or filter criteria. Add a new review to get started!", actionText = "+ Add Review", onAction }) {
  return (
    <div style={{
      padding: '3rem 1.5rem',
      textAlign: 'center',
      background: '#fef9f4',
      borderRadius: '16px',
      border: '2px dashed #e8d5bc',
      margin: '1.5rem 0'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h4 style={{ color: '#3e2410', fontWeight: 700, marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h4>
      <p style={{ color: '#6b4c35', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '25px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
