import React, { useEffect } from 'react';

/**
 * Toast component
 * @param {string} message - notification text to display
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {function} onClose - function called when toast closes
 */
/*Toast is a small notification popup that appears at the 
bottom-right of the screen and disappears automatically 
after 3 seconds. 
Like when you save something and see "Saved successfully!" pop up. 

message — the text to show e.g. "Review submitted!"
type — success (green), error (red), warning (yellow), info (blue)
onClose — function to hide it        */

function Toast({ message, type = 'success', onClose }) {

  // auto dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
  }[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <div className={`toast show text-white ${bgClass}`} role="alert">
        <div className="d-flex align-items-center p-3">
          <span className="me-auto">{message}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
