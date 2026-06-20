import React from 'react';

/**
 * Button component
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {function} onClick - click handler
 * @param {React.ReactNode} children - button label
 * @param {boolean} disabled - disables the button
 */

function Button({ variant = 'primary', size = 'md', onClick, children, disabled = false }) {
/* props what the button accepts */
  const baseClass = 'btn';

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size];

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
