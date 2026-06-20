import React from 'react';

function Input({ label, placeholder, type = 'text', value, onChange, error }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="form-control"
      />
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default Input;
