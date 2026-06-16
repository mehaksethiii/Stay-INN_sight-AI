import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>INN Sight AI</h5>
            <p className="text-muted">A smart guest review classifier system powered by AI.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h6>Links</h6>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="#about" className="text-muted text-decoration-none">About</a></li>
              <li><a href="#dashboard" className="text-muted text-decoration-none">Dashboard</a></li>
              <li><a href="#contact" className="text-muted text-decoration-none">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h6>Follow Us</h6>
            <a href="#twitter" className="text-muted me-3 text-decoration-none">Twitter</a>
            <a href="#instagram" className="text-muted me-3 text-decoration-none">Instagram</a>
            <a href="#linkedin" className="text-muted text-decoration-none">LinkedIn</a>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-muted mb-0">&copy; 2025 INN Sight AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
