import React from 'react';

function Loader({ size = 'md' }) {

  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg',
  }[size];

  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <div
        className={`spinner-border text-primary ${sizeClass}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
