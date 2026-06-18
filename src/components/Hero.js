import React from 'react';

function Hero() {
  return (
    <section className="py-5 text-center bg-light">
      <div className="container">
        <h1 className="display-4 fw-bold">Explore smartly with INN Sight AI</h1>
        <p className="lead">An amazing Guest review classifier System</p>
        <p className="text-muted">Discover insights from hotel reviews powered by AI</p>
        <a href="#get-started" className="btn btn-primary btn-lg me-2">Get Started</a>
        <a href="#learn-more" className="btn btn-outline-secondary btn-lg">Learn More</a>
        <div className="mt-4">
          <img src="/image_2.png" alt="INN Sight AI" style={{ width: '200px', height: 'auto' }} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
