import React from 'react';

/**
 * Loader component
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
/* function Loader({ size = 'md' }) {
Takes one prop — size (sm, md, lg). Default is md.
spinner-border — Bootstrap's built-in spinning circle CSS 
animation
text-primary — makes it blue
visually-hidden — hides the "Loading..." text visually 
but screen readers can still read it (accessibility)*/

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
