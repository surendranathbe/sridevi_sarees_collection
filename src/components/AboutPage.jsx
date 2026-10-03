import React, { useState, useEffect } from 'react';
import './components.css';

// Reusing existing project assets
import heroBannerImg from '../assets/pattu-saree-banner1.png';
import aboutShowroomImg from '../assets/about-image-2.jpg';
import storyPortraitImg from '../assets/collections/model_emerald_green.jpg';
import storyDrapeImg from '../assets/collections/saree_dusty_plum.jpg';
import blouseCraftImg from '../assets/blouses/blouse_emerald_peacock.jpg';
import ctaBgImg from '../assets/collections/saree_emerald_green.jpg';

// Category Grid Images
import catSilk from '../assets/silk-sarees-banner1.png';
import catDesigner from '../assets/desginer_sarees-banner1.png';
import catBridal from '../assets/occasions/wedding.jpg';
import catFestive from '../assets/occasions/diwali.jpg';
import catDola from '../assets/collections/saree_dusty_plum.jpg';
import catCrepe from '../assets/collections/saree_royal_blue.jpg';
import catMaheshwari from '../assets/occasions/sankranti.jpg';
import catMangalagiri from '../assets/pattu-saree-banner1.png';

/* ==========================================================================
   DATA-DRIVEN MANIFESTO & PHILOSOPHY
   ========================================================================== */

const brandPurposeData = [
  {
    id: 'mission',
    number: '01',
    label: 'OUR MISSIONS',
    title: 'Our Missions',
    tagline: 'Purpose & Saree Craft',
    statement: 'To make every saree-shopping experience beautiful, comfortable and memorable.',
    description:
      'We bring customers thoughtfully selected sarees that combine superior fabric quality, refined aesthetics, and warm, dependable service.',
    highlights: [
      {
        tag: 'CURATED QUALITY',
        desc: 'Handpicked authentic pure silks, lightweight weaves & festive drapes.'
      },
      {
        tag: 'ARTISAN EMBROIDERY',
        desc: 'Precision computerized embroidery & custom bridal blouse artistry.'
      },
      {
        tag: 'PERSONALIZED CARE',
        desc: 'Dedicated drape guidance and hospitable service for every family.'
      }
    ],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: 'values',
    number: '02',
    label: 'OUR CORE VALUES',
    title: 'Our Core Values',
    tagline: 'Bedrock & Hospitality',
    statement: 'The bedrock of our everyday craft, curation and customer care.',
    description:
      'Every collection and interaction is guided by our dedication to genuine quality, timeless appeal and heartfelt hospitality.',
    highlights: [
      {
        tag: 'QUALITY & FINISH',
        desc: 'Carefully selected collections with attention to fabric, finish and comfort.'
      },
      {
        tag: 'TIMELESS ELEGANCE',
        desc: 'Classic Indian aesthetics combined with contemporary style.'
      },
      {
        tag: 'TRUST & INTEGRITY',
        desc: 'Building lasting relationships through consistent and dependable service.'
      }
    ],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    id: 'vision',
    number: '03',
    label: 'OUR VISION',
    title: 'Our Vision',
    tagline: 'Future & Heritage',
    statement: 'To become the most trusted destination for saree fashion in Kandukur and beyond.',
    description:
      'We envision building a destination celebrated for authentic collections, timeless craftsmanship, personalized care and lasting relationships.',
    highlights: [
      {
        tag: 'TRUSTED DESTINATION',
        desc: 'Kandukur’s premier showroom for bridal, festive and celebration sarees.'
      },
      {
        tag: 'HERITAGE WEAVES',
        desc: 'Preserving and honoring timeless Andhra handloom traditions.'
      },
      {
        tag: 'LASTING BONDS',
        desc: 'Building generational trust through dependable service and fair pricing.'
      }
    ],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    )
  }
];

const categoryPhilosophy = [
  { name: 'Silk Sarees', image: catSilk, tag: 'Pure Weaves' },
  { name: 'Designer Sarees', image: catDesigner, tag: 'Modern Drape' },
  { name: 'Bridal Sarees', image: catBridal, tag: 'Sacred Muhurtham' },
  { name: 'Festive Sarees', image: catFestive, tag: 'Auspicious Celebrations' },
  { name: 'Dola Silk Sarees', image: catDola, tag: 'Soft Flow' },
  { name: 'Crepe Sarees', image: catCrepe, tag: 'Effortless Charm' },
  { name: 'Maheshwari Silk Sarees', image: catMaheshwari, tag: 'Heritage Border' },
  { name: 'Mangalagiri Pattu Sarees', image: catMangalagiri, tag: 'Artisan Pride' }
];

/* ==========================================================================
   SUBCOMPONENTS
   ========================================================================== */

/** 1. Sub-banner Hero */
const AboutHero = ({ onNavigate }) => {
  return (
    <section className="about-hero-subbanner" aria-label="About Sridevi Collections Banner">
      <div className="about-hero-bg-wrapper">
        <img
          src={heroBannerImg}
          alt="Sridevi Sarees Craftsmanship and Fabric Texture"
          className="about-hero-bg-image"
          loading="eager"
        />
        <div className="about-hero-gradient-overlay" />
      </div>

      <div className="about-hero-content-wrap">
        <span className="about-hero-eyebrow">ABOUT SRIDEVI COLLECTIONS</span>

        <h1 className="about-hero-heading">
          Elegance Woven Into Every Story
        </h1>

        <div className="about-hero-divider" aria-hidden="true">
          <span className="divider-line" />
          <span className="divider-diamond">✦</span>
          <span className="divider-line" />
        </div>

        <p className="about-hero-support-text">
          Discover our passion for beautiful sarees, thoughtful craftsmanship and timeless Indian elegance.
        </p>

        {/* Minimal Breadcrumb */}
        <nav className="about-hero-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="breadcrumb-home-link"
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">About Us</span>
        </nav>
      </div>
    </section>
  );
};

/** 2. Editorial Introduction / Story Section */
const AboutStory = () => {
  return (
    <section className="about-story-section" id="about-our-story" aria-label="Our Story & Showroom Studio">
      <div className="about-story-container">
        {/* Left Column: Showroom & Studio Showcase Image (about-image-2.jpg) */}
        <div className="about-story-image-col">
          <div className="story-image-frame">
            <div className="story-image-inner">
              <img
                src={aboutShowroomImg}
                alt="Sridevi Sarees Showroom and Computer Embroidery Studio in Kandukur"
                className="story-primary-img"
                loading="eager"
              />
              <div className="story-image-glow-overlay" aria-hidden="true" />
            </div>

            {/* Floating Showroom Badge */}
            <div className="story-floating-card">
              <div className="floating-card-icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="floating-card-info">
                <span className="card-kandukur-label">KANDUKUR SHOWROOM &amp; STUDIO</span>
                <span className="card-kandukur-title">Authentic Silks &amp; Computer Embroidery</span>
              </div>
            </div>

            <div className="story-frame-gold-border" aria-hidden="true" />
          </div>
        </div>

        {/* Right Column: Narrative Story Content with Bright Visibility & Zero Scroll */}
        <div className="about-story-text-col">
          <div className="story-eyebrow-row">
            <span className="story-eyebrow-accent">✦</span>
            <span className="story-eyebrow-text">OUR STORY &amp; HERITAGE</span>
            <span className="story-eyebrow-accent">✦</span>
          </div>

          <h2 className="story-main-heading">
            Where Handpicked Sarees Meet Precision Blouse Artistry
          </h2>

          <div className="story-body-copy">
            <p className="story-lead-text">
              Welcome to <strong>Sridevi Sarees Collections</strong> in Kandukur, Andhra Pradesh — bringing together the finest handpicked pure silk pattu, festive weaves, and contemporary celebration drapes chosen for fabric purity and radiant colors.
            </p>
            <p>
              Complementing our collections is our in-house computer embroidery studio, crafting bespoke bridal blouses with precision zardozi work and custom motifs that elevate your saree into an unforgettable ensemble.
            </p>
          </div>

          {/* Compact 3-Pill Feature Badges */}
          <div className="story-features-row">
            <div className="story-feature-pill">
              <span className="story-pill-dot" aria-hidden="true">✦</span>
              <div className="story-pill-text">
                <strong>Pure Silks</strong> Handpicked authentic weaves
              </div>
            </div>
            <div className="story-feature-pill">
              <span className="story-pill-dot" aria-hidden="true">✦</span>
              <div className="story-pill-text">
                <strong>Blouse Craft</strong> Custom computer embroidery
              </div>
            </div>
            <div className="story-feature-pill">
              <span className="story-pill-dot" aria-hidden="true">✦</span>
              <div className="story-pill-text">
                <strong>Kandukur Store</strong> Trusted local hospitality
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** 3. Interactive Brand Purpose Showcase (Sidebar Tabs + Focused Content) */
const BrandPurpose = () => {
  const [activeTabId, setActiveTabId] = useState('mission');
  const activeData = brandPurposeData.find((item) => item.id === activeTabId) || brandPurposeData[0];

  return (
    <section className="about-purpose-section" id="about-brand-purpose" aria-label="Our Missions, Core Values & Vision">
      {/* Unified Single Section Showcase (100% Full-Width Edge-to-Edge with Zero Gaps) */}
      <div className="purpose-showcase-box">
        {/* Left Sidebar Navigation */}
        <aside className="purpose-sidebar" aria-label="Brand Pillars Navigation">
          <div className="purpose-sidebar-header">
            <span className="sidebar-header-label">WHAT DEFINES US</span>
            <h2 className="sidebar-main-title">Our Foundation</h2>
          </div>

          <div className="purpose-sidebar-tabs" role="tablist" aria-orientation="vertical">
              {brandPurposeData.map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`purpose-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`purpose-panel-${tab.id}`}
                    className={`purpose-tab-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <div className="tab-indicator" aria-hidden="true" />
                    <div className="tab-number-wrap">
                      <span className="tab-number">{tab.number}</span>
                    </div>
                    <div className="tab-info">
                      <span className="tab-title">{tab.title}</span>
                      <span className="tab-tagline">{tab.tagline || tab.label}</span>
                    </div>
                    <div className="tab-arrow-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Bottom Motif */}
            <div className="purpose-sidebar-footer" aria-hidden="true">
              <span className="sidebar-motif">⚜ Sridevi Collections ⚜</span>
            </div>
          </aside>

          {/* Right Focused Content Display Panel */}
          <section
            className="purpose-content-area"
            id={`purpose-panel-${activeData.id}`}
            role="tabpanel"
            aria-labelledby={`purpose-tab-${activeData.id}`}
            key={activeData.id}
          >
            <div className="purpose-content-inner">
              {/* Content Header Meta */}
              <div className="content-meta-bar">
                <div className="meta-badge">
                  <span className="meta-number">{activeData.number}</span>
                  <span className="meta-sep">/</span>
                  <span className="meta-category">{activeData.label}</span>
                </div>
                <div className="meta-icon-badge" aria-hidden="true">
                  {activeData.icon}
                </div>
              </div>

              <h3 className="content-heading">{activeData.title}</h3>

              {/* Statement Block with Focus Attraction */}
              <div className="content-statement-card">
                <div className="statement-quote-mark" aria-hidden="true">“</div>
                <p className="statement-text">"{activeData.statement}"</p>
              </div>

              {/* Detailed Narrative */}
              <p className="content-description">{activeData.description}</p>

              {/* 3 Highlight Cards */}
              {activeData.highlights && activeData.highlights.length > 0 && (
                <div className="content-highlights-grid">
                  {activeData.highlights.map((item, idx) => (
                    <div
                      key={item.tag}
                      className="content-highlight-card"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <div className="highlight-card-top">
                        <span className="highlight-dot" aria-hidden="true" />
                        <span className="highlight-tag">{item.tag}</span>
                      </div>
                      <p className="highlight-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
  );
};

/** 5. Collection Philosophy Section */
const CollectionPhilosophy = () => {
  return (
    <section className="about-philosophy-section" aria-label="Collection Philosophy">
      <div className="about-philosophy-container">
        <div className="philosophy-header">
          <span className="philosophy-eyebrow">CURATED SELECTION</span>
          <h2 className="philosophy-heading">Designed For Every Occasion</h2>
          <p className="philosophy-subtitle">
            From timeless silk sarees to contemporary designer styles, our collections are thoughtfully selected for weddings, celebrations, festivals and everyday elegance.
          </p>
        </div>

        {/* Category Grid */}
        <div className="philosophy-category-grid">
          {categoryPhilosophy.map((cat) => (
            <article key={cat.name} className="philosophy-category-card">
              <div className="cat-image-wrapper">
                <img
                  src={cat.image}
                  alt={`${cat.name} Collection`}
                  className="cat-card-img"
                  loading="lazy"
                />
                <div className="cat-card-overlay" />
                <span className="cat-card-badge">{cat.tag}</span>
              </div>
              <div className="cat-card-footer">
                <h3 className="cat-card-title">{cat.name}</h3>
                <span className="cat-card-arrow">&rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/** 6. Computer Embroidery / Blouse Craft Section */
const CraftsmanshipSection = ({ onNavigate }) => {
  return (
    <section className="about-craft-section" aria-label="Computer Embroidery and Blouse Craft">
      <div className="about-craft-container">
        <div className="craft-split-layout">
          {/* Left Column: Embroidery Showcase Image */}
          <div className="craft-image-col">
            <div className="craft-image-wrap">
              <img
                src={blouseCraftImg}
                alt="Precision Computer Embroidery Work Blouse"
                className="craft-main-image"
                loading="lazy"
              />
              <div className="craft-image-backdrop" aria-hidden="true" />
              <div className="craft-floating-tag">
                <span>Computerized Embroidery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Craft Details */}
          <div className="craft-text-col">
            <div className="craft-eyebrow-wrap">
              <span className="craft-accent">✦</span>
              <span className="craft-eyebrow">CRAFTED DETAILS</span>
              <span className="craft-accent">✦</span>
            </div>

            <h2 className="craft-heading">
              Complete Your Look With Detailed Craftsmanship
            </h2>

            <p className="craft-description">
              Our computer blouse work and embroidery services add a personalized finishing touch to your saree, helping create a complete and elegant look for every special occasion.
            </p>

            <button
              type="button"
              className="craft-cta-button"
              onClick={() => onNavigate('#our-blouse-collection')}
            >
              <span>Explore Blouse Work</span>
              <span className="cta-arrow">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/** 7. Final Closing CTA Section */
const AboutCTA = ({ onNavigate }) => {
  return (
    <section className="about-cta-section" aria-label="Discover Your Saree">
      <div className="about-cta-bg">
        <img
          src={ctaBgImg}
          alt="Royal Saree Weave"
          className="about-cta-bg-img"
          loading="lazy"
        />
        <div className="about-cta-overlay" />
      </div>

      <div className="about-cta-container">
        <div className="about-cta-content">
          <div className="cta-motif">✦ ✦ ✦</div>
          <h2 className="about-cta-heading">Find A Saree That Feels Like You</h2>
          <p className="about-cta-subtext">
            Explore our latest collections and discover styles created for celebrations, traditions and everyday elegance.
          </p>

          <div className="about-cta-btn-group">
            <button
              type="button"
              className="about-btn-primary"
              onClick={() => onNavigate('#our-collections')}
            >
              <span>Explore Collection</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button
              type="button"
              className="about-btn-secondary"
              onClick={() => onNavigate('#contact-us')}
            >
              <span>Visit Store</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   MAIN EXPORT: AboutPage
   ========================================================================== */

const AboutPage = ({ onNavigate = () => {} }) => {
  // Update SEO Page Title and Metadata on mount
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'About Sridevi Sarees Collections | Sarees & Ethnic Wear in Kandukur';

    // Meta description update
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover Sridevi Sarees Collections in Kandukur — thoughtfully selected sarees, elegant designs, quality fabrics and computer blouse embroidery services.'
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = originalTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  return (
    <main className="about-page-wrapper" id="about-page-top">
      {/* 1. Sub-banner Hero */}
      <AboutHero onNavigate={onNavigate} />

      {/* 2. Editorial Introduction */}
      <AboutStory />

      {/* 3. Purpose: Mission, Vision, and Core Values Interactive Manifesto */}
      <BrandPurpose />

      {/* 4. Collection Philosophy Grid */}
      <CollectionPhilosophy />

      {/* 5. Craftsmanship & Computer Embroidery */}
      <CraftsmanshipSection onNavigate={onNavigate} />

      {/* 6. Closing Call to Action */}
      <AboutCTA onNavigate={onNavigate} />
    </main>
  );
};

export default AboutPage;
