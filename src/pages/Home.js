import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Button from '../components/ui/Button';

function Home() {
  return (
    <>
      <Hero />
      <div className="container my-5">
        <h2 className="mb-4">Featured Reviews</h2>
        <div className="d-flex flex-wrap gap-4">
          <Card
            title="Hotel Review"
            description="Great location, friendly staff."
            image="/hotel.png"
            action={{ label: "Read More", onClick: () => console.log("clicked") }}
          />
          <Card
            title="Guest Experience"
            description="Comfortable rooms and excellent service."
            image="/guestexperience.png"
            action={{ label: "Read More", onClick: () => console.log("clicked") }}
          />
          <Card
            title="Dining Review"
            description="Amazing breakfast and rooftop dining experience."
            image="/diningreview.png"
            action={{ label: "Read More", onClick: () => console.log("clicked") }}
          />
        </div>
        <div className="d-flex gap-3 mt-4">
          <Button variant="primary" size="lg">Get Started</Button>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="secondary" size="md" disabled>Disabled</Button>
        </div>
      </div>
    </>
  );
}

export default Home;
