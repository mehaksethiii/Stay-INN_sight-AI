import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';

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
        </div>
      </div>
    </>
  );
}

export default Home;
