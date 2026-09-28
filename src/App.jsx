import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SareeHero from './components/SareeHero';
import silkBanner from './assets/silk-sarees-banner1.png';
import pattuBanner from './assets/pattu-saree-banner1.png';
import designerBanner from './assets/desginer_sarees-banner1.png';
import handloomBanner from './assets/handloom-sarees-banner1.jpg';
import './App.css';

const featuredDrapes = [
  {
    id: 'pattu',
    title: 'Kanchipuram Pattu',
    shortName: 'Kanchipuram',
    tag: 'Bridal Heritage',
    image: pattuBanner,
    price: '₹1,000 - ₹5,600',
    fabric: 'Pure Mulberry Silk • Real Zari',
    weavingTime: '180+ Hours on Handloom'
  },
  {
    id: 'silk',
    title: 'Royal Dola Silk',
    shortName: 'Dola Silk',
    tag: 'Festive Classic',
    image: silkBanner,
    price: '₹800 - ₹4,500',
    fabric: 'Heritage Handwoven Silk',
    weavingTime: '120+ Hours on Loom'
  },
  {
    id: 'designer',
    title: 'Designer Silk Drape',
    shortName: 'Designer',
    tag: 'Contemporary Edit',
    image: designerBanner,
    price: '₹650 - ₹5,500',
    fabric: 'Raw Silk & Silver Brocade',
    weavingTime: '90+ Hours of Craft'
  },
  {
    id: 'handloom',
    title: 'Artisan Handloom',
    shortName: 'Handloom',
    tag: 'Authentic Weave',
    image: handloomBanner,
    price: '₹800 - ₹8,500',
    fabric: 'Organic Cotton & Tussar Silk',
    weavingTime: '140+ Hours of Artistry'
  }
];

function App() {
  const [selectedDrapeId, setSelectedDrapeId] = useState('pattu');
  const [isInView, setIsInView] = useState(false);
  const aboutRef = useRef(null);
  const activeDrape = featuredDrapes.find((d) => d.id === selectedDrapeId) || featuredDrapes[0];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Sticky & Transparent Header with Centered Logo & Action Icons */}
      <Navbar />

      {/* Main Luxury Full-Width Saree Showcase Hero Banner */}
      <main id="main-content">
        <SareeHero />

        {/* =========================================================
            LUXURY SILK ZARI TRANSITION SEAM BETWEEN HERO & ABOUT
            ========================================================= */}
        <div id="collection-anchor" className="banner-scroll-seam">
          <div className="scroll-seam-line" aria-hidden="true" />
          <button
            type="button"
            className="scroll-seam-badge"
            onClick={scrollToAbout}
            aria-label="Scroll to Sridevi Heritage Collections"
          >
            <span className="seam-ornament">✦</span>
            <span>DISCOVER THE HERITAGE</span>
            <span className="seam-ornament">✦</span>
          </button>
          <div className="scroll-seam-line" aria-hidden="true" />
        </div>

        {/* =========================================================
            ABOUT US / HERITAGE SHOWCASE (FITS ON ONE SCREEN)
            ========================================================= */}
        <section 
          id="about-us" 
          ref={aboutRef}
          className={`about-heritage-section ${isInView ? 'in-view' : ''}`}
          aria-label="About Sridevi Collections"
        >
          {/* Ambient Gold & Maroon Radial Bloom */}
          <div className="about-ambient-glow" aria-hidden="true" />

          <div className="about-container">
            {/* Left Column: Visual Saree Card & Thumbnails */}
            <div className="about-visual-col">
              <div className="about-image-card">
                <span className="about-badge">Silk Mark Certified • 100% Pure</span>
                <img
                  src={activeDrape.image}
                  alt={activeDrape.title}
                  className="about-showcase-img"
                  key={activeDrape.id}
                />
                <div className="about-floating-bar">
                  <h4>{activeDrape.title}</h4>
                  <span>{activeDrape.price}</span>
                </div>
              </div>

              {/* Saree Thumbnails */}
              <div className="about-thumbs" role="tablist">
                {featuredDrapes.map((drape) => (
                  <button
                    key={drape.id}
                    type="button"
                    role="tab"
                    aria-selected={drape.id === selectedDrapeId}
                    className={`about-thumb-btn ${drape.id === selectedDrapeId ? 'active' : ''}`}
                    onClick={() => setSelectedDrapeId(drape.id)}
                  >
                    <img src={drape.image} alt={drape.title} />
                    <span>{drape.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Rich About Content */}
            <div className="about-content-col">
              <div className="about-eyebrow">✦ About Sridevi Collections ✦</div>

              <h2 className="about-title">
                Woven with <span>Royalty</span>, Draped in Elegance
              </h2>

              <p className="about-desc">
                Handcrafted on traditional looms by master weavers across Kanchipuram, Varanasi, 
                and Chanderi, our sarees unite pure zari filaments, natural dyes, and 
                centuries-old heirloom motifs.
              </p>

              {/* 4 Compact Feature Badges */}
              <div className="about-grid">
                <div className="about-card">
                  <div className="about-card-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Pure Silk &amp; Real Zari</h4>
                    <p>Silk Mark certified Mulberry silk &amp; genuine gold thread.</p>
                  </div>
                </div>

                <div className="about-card">
                  <div className="about-card-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h4>Master Loom Artistry</h4>
                    <p>Ancestral handloom weaving with heritage temple borders.</p>
                  </div>
                </div>

                <div className="about-card">
                  <div className="about-card-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12l4 6-10 12L2 9z" />
                      <path d="M11 3 8 9l4 12 4-12-3-6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Bespoke Finishing</h4>
                    <p>Complimentary fall, edging &amp; matching blouse styling.</p>
                  </div>
                </div>

                <div className="about-card">
                  <div className="about-card-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <h4>Worldwide Insured Delivery</h4>
                    <p>Tamper-proof royal packaging with door-to-door express transit.</p>
                  </div>
                </div>
              </div>

              {/* Compact Stats Row */}
              <div className="about-stats">
                <div className="about-stat-item">
                  <span className="about-stat-num">25+</span>
                  <span className="about-stat-lbl">Years of Trust</span>
                </div>
                <div className="about-stat-item">
                  <span className="about-stat-num">15K+</span>
                  <span className="about-stat-lbl">Curated Sarees</span>
                </div>
                <div className="about-stat-item">
                  <span className="about-stat-num">100%</span>
                  <span className="about-stat-lbl">Pure Handloom</span>
                </div>
                <div className="about-stat-item">
                  <span className="about-stat-num">4.9 ★</span>
                  <span className="about-stat-lbl">Customer Rating</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="about-actions">
                <button
                  type="button"
                  className="about-btn-primary"
                  onClick={() => {
                    const el = document.getElementById('collection-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Collection</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <a href="tel:+919849837338" className="about-btn-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>Video Consultation</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


