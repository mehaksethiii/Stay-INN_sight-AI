import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fef9f4 0%, #f5ede0 100%)',
          color: '#3e2410'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: '1rem' }}>
            Oops! Something went wrong.
          </h2>
          <p style={{ color: '#6b4c35', maxWidth: '500px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            An unexpected render error occurred in the application. Don't worry, your data is safe.
          </p>
          {this.state.error && (
            <div style={{
              background: '#fce4ec',
              color: '#c62828',
              padding: '0.8rem 1.2rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              maxWidth: '600px',
              marginBottom: '1.5rem',
              wordBreak: 'break-word'
            }}>
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={this.handleReset}
            style={{
              background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '25px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            🔄 Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
