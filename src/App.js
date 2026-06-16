import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Card from './components/Card';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="container my-5">
        <div className="d-flex flex-wrap gap-4">
          <Card
            title="Hotel Review"
            description="Great location, friendly staff."
            image="/hotel.png"
            action={{ label: "Read More", onClick: () => console.log("clicked") }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
