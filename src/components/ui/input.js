import React from 'react';

/**
 * Input component
 * @param {string} label - input label text
 * @param {string} placeholder - placeholder text
 * @param {string} type - input type e.g. 'text' | 'email' | 'password'
 * @param {string} value - controlled value
 * @param {function} onChange - change handler
 * @param {string} error - error message to display below input
 */

/*Things to remember:

React component names must start with capital letter — Input not input
Prop names are case sensitive — onChange not onchange
Always export default at the end */

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
