import React from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Sticky & Transparent Header with Centered Logo & Action Icons */}
      <Navbar />

      {/* Luxury Showcase Canvas to experience sticky scrolling & background transparency */}
      <main className="hero-scroll-canvas">
        <div className="silk-ambient-glow" />

        <div className="hero-welcome-content">
          <span className="hero-subheading">Haute Couture &bull; Handcrafted Sarees</span>
          <h1 className="hero-main-title">Elegance Woven with Royal Heritage</h1>
          <p className="hero-tagline">
            Experience timeless luxury with curated silk weaves and bespoke bridal artistry.
          </p>

          <div className="scroll-indicator-pill">
            <span>Scroll to see sticky header &amp; transparent glass</span>
            <span className="scroll-arrow-down">&darr;</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
