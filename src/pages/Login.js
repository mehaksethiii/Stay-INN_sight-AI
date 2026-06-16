import React from 'react';

function Login() {
  return (
    <div className="container my-5" style={{ maxWidth: '400px' }}>
      <h1>Login</h1>
      <p className="lead">Sign in to access your INN Sight AI dashboard.</p>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" placeholder="Enter email" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
