import React, { useState, useEffect, useRef, useCallback } from 'react';
import './components.css';

const sarees = [
  {
    id: 1,
    image: 'src/assets/silk-sarees-banner1.png',
    title: 'Silk Sarees',
    subtitle: 'Dola Silk • Kanchipuram • Banarasi • Pure Silk',
    tag: 'Premium Collection',
    fabric: 'Elegant Silk Weaves',
    duration: '0:16',
    subheadline: 'Pure Kanchipuram, Banarasi & Dola Silk',
    description: 'Experience regal grace with our authentic silk collection, hand-woven with shimmering zari borders and time-honored heritage motifs.'
  },
  {
    id: 2,
    image: 'src/assets/cotton-sarees-banner1.png',
    title: 'Cotton Sarees',
    subtitle: 'Soft Cotton • Mulmul • Kota • Lightweight Weaves',
    tag: 'Everyday Elegance',
    fabric: 'Premium Cotton',
    duration: '0:18',
    subheadline: 'Breathable Mulmul, Kota & Lightweight Weaves',
    description: 'Embrace effortless charm and daily comfort with our ultra-soft cotton sarees, crafted for breezy, all-day sophistication.'
  },
  {
    id: 3,
    image: 'src/assets/pattu-saree-banner1.png',
    title: 'Pattu Sarees',
    subtitle: 'Bridal Pattu • Kanjivaram • Temple Zari • Festive Weaves',
    tag: 'Bridal Collection',
    fabric: 'Pure Pattu Silk',
    duration: '0:14',
    subheadline: 'Sacred Temple Zari & Festive Bridal Drapes',
    description: 'Celebrate your most auspicious moments in majestic South Indian bridal pattu drapes woven to royal perfection.'
  },
  {
    id: 4,
    image: 'src/assets/desginer_sarees-banner1.png',
    title: 'Designer Sarees',
    subtitle: 'Modern Drapes • Statement Borders • Party Wear • Luxury Styles',
    tag: 'Trending Now',
    fabric: 'Designer Collection',
    duration: '0:20',
    subheadline: 'Contemporary Silhouettes & Statement Borders',
    description: 'Make an unforgettable entrance with our high-fashion designer drapes featuring exquisite embellishments and modern glamour.'
  },
  {
    id: 5,
    image: 'src/assets/priented-sarees-banner1.jpg',
    title: 'Printed Sarees',
    subtitle: 'Floral Prints • Digital Prints • Contemporary Patterns • Elegant Drapes',
    tag: 'New Arrivals',
    fabric: 'Premium Printed Fabrics',
    duration: '0:15',
    subheadline: 'Floral Prints, Digital Art & Contemporary Motifs',
    description: 'Infuse artistic flair into your wardrobe with breezy printed sarees boasting expressive color palettes and lightweight luxury.'
  },
  {
    id: 6,
    image: 'src/assets/handloom-sarees-banner1.jpg',
    title: 'Handloom Sarees',
    subtitle: 'Traditional Weaves • Artisan Craft • Heritage Designs • Natural Textures',
    tag: 'Heritage Edit',
    fabric: 'Authentic Handloom',
    duration: '0:17',
    subheadline: 'Artisanal Craftsmanship & Heritage Textures',
    description: 'Cherish timeless hand-woven artistry passed down generations, honoring indigenous weavers and natural organic textures.'
  }
];

const categoryPills = [
  {
    id: 'designer',
    label: 'Designer Sarees',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M11 3 8 9l4 12 4-12-3-6" />
        <path d="M2 9h20" />
      </svg>
    )
  },
  {
    id: 'silk',
    label: 'Silk Sarees',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      </svg>
    )
  },
  {
    id: 'party',
    label: 'Party Wear Sarees',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    )
  },
  {
    id: 'traditional',
    label: 'Traditional Collections',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    )
  }
];

export default function SareeHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const totalSarees = sarees.length;

  // Synchronize dynamic text with active carousel slide
  useEffect(() => {
    if (currentIndex === displayIndex) return;

    setIsExiting(true);
    const timer = setTimeout(() => {
      setDisplayIndex(currentIndex);
      setIsExiting(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [currentIndex, displayIndex]);

  // Preload all high-res images to guarantee zero-latency transitions
  useEffect(() => {
    sarees.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSarees);
  }, [totalSarees]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSarees) % totalSarees);
  }, [totalSarees]);

  // Smooth automatic carousel rotation every 3.6 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3600);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch & Swipe handlers for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  // Keyboard navigation support
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Card positioning calculator for horizontal overlapping carousel
  const getCardStyle = (index) => {
    const diff = (index - currentIndex + totalSarees) % totalSarees;

    // Responsive compact stack on mobile devices
    if (isMobile) {
      if (diff === 0) {
        return {
          transform: 'translate3d(0, 0, 0) scale(1)',
          zIndex: 10,
          opacity: 1,
          pointerEvents: 'auto',
          visibility: 'visible',
        };
      } else if (diff === 1) {
        return {
          transform: 'translate3d(20px, 0, -20px) scale(0.95)',
          zIndex: 8,
          opacity: 0.85,
          pointerEvents: 'auto',
          visibility: 'visible',
        };
      } else if (diff === 2) {
        return {
          transform: 'translate3d(38px, 0, -40px) scale(0.90)',
          zIndex: 6,
          opacity: 0.55,
          pointerEvents: 'auto',
          visibility: 'visible',
        };
      } else if (diff === totalSarees - 1) {
        return {
          transform: 'translate3d(-20px, 0, -20px) scale(0.95)',
          zIndex: 1,
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
        };
      } else {
        return {
          transform: 'translate3d(45px, 0, -50px) scale(0.85)',
          zIndex: 0,
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
        };
      }
    }

    if (diff === 0) {
      // Main foreground showcase card
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        zIndex: 10,
        opacity: 1,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    } else if (diff === 1) {
      // 2nd card (stacked directly behind main, peeking to the right)
      return {
        transform: 'translate3d(150px, 0, -30px) scale(0.94)',
        zIndex: 8,
        opacity: 0.96,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    } else if (diff === 2) {
      // 3rd card
      return {
        transform: 'translate3d(280px, 0, -60px) scale(0.88)',
        zIndex: 6,
        opacity: 0.90,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    } else if (diff === 3) {
      // 4th card
      return {
        transform: 'translate3d(390px, 0, -90px) scale(0.82)',
        zIndex: 4,
        opacity: 0.82,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    } else if (diff === 4) {
      // 5th card peeking far right
      return {
        transform: 'translate3d(490px, 0, -120px) scale(0.76)',
        zIndex: 2,
        opacity: 0.60,
        pointerEvents: 'auto',
        visibility: 'visible',
      };
    } else if (diff === totalSarees - 1) {
      // Exiting card to the left
      return {
        transform: 'translate3d(-140px, 0, -40px) scale(0.92)',
        zIndex: 1,
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      };
    } else {
      // Inactive card waiting on the right
      return {
        transform: 'translate3d(580px, 0, -150px) scale(0.7)',
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      };
    }
  };

  const activeSaree = sarees[displayIndex] || sarees[0];

  const renderAnimatedLetters = (title) => {
    let charCounter = 0;
    const words = title.split(' ');

    return words.map((word, wordIdx) => {
      const letters = word.split('');
      return (
        <span key={`${displayIndex}-w-${wordIdx}`} className="saree-title-word" aria-hidden="true">
          {letters.map((char, charIdx) => {
            const delay = (charCounter * 0.04).toFixed(3);
            charCounter++;
            return (
              <span
                key={`${displayIndex}-c-${wordIdx}-${charIdx}`}
                className="saree-letter-char"
                style={{ animationDelay: `${delay}s` }}
              >
                {char}
              </span>
            );
          })}
          {wordIdx < words.length - 1 && (
            <span className="saree-word-spacer">&nbsp;</span>
          )}
        </span>
      );
    });
  };

  const getPillTargetIndex = (id) => {
    switch (id) {
      case 'silk': return 0;
      case 'designer': return 3;
      case 'party': return 4;
      case 'traditional': return 2;
      default: return 0;
    }
  };

  const isCategoryActive = (id) => {
    switch (id) {
      case 'silk': return displayIndex === 0;
      case 'designer': return displayIndex === 3;
      case 'party': return displayIndex === 4;
      case 'traditional': return displayIndex === 2 || displayIndex === 5;
      default: return false;
    }
  };

  return (
    <section
      id="home"
      className="saree-hero-section"
      aria-label="Saree Collection Showcase"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Background Ambience: Subtle Warm Damask Textile Pattern & Golden Lighting */}
      <div className="saree-hero-ambient-texture" aria-hidden="true" />
      <div className="saree-hero-gold-glow-left" aria-hidden="true" />
      <div className="saree-hero-gold-glow-right" aria-hidden="true" />

      <div className="saree-hero-container">

        {/* =========================================
            LEFT COLUMN: CONTENT (Approx 45% Desktop)
            ========================================= */}
        <div className="saree-hero-content-col">
          {/* Intro Header Group */}
          <div className={`saree-hero-intro ${isExiting ? 'is-exiting' : 'is-entering'}`}>
            {/* Eyebrow Label */}
            <div className="saree-eyebrow-wrapper">
              <span className="saree-eyebrow-accent-line" />
              <span className="saree-eyebrow-text">
                {activeSaree.tag.toUpperCase()}
              </span>
              <span className="saree-eyebrow-accent-line" />
            </div>

            {/* Main Headline with Letter-by-Letter Flow Animation */}
            <h1 className="saree-hero-headline" aria-label={activeSaree.title}>
              {renderAnimatedLetters(activeSaree.title)}
            </h1>

            {/* Supporting Headline */}
            <h2 className="saree-hero-subheadline">
              {activeSaree.subheadline}
            </h2>

            {/* Short Description / Tagline */}
            <p className="saree-hero-description">
              {activeSaree.description}
            </p>
          </div>

          {/* Category Highlight Badges */}
          <div className="saree-category-pill-grid">
            {categoryPills.map((cat) => (
              <div
                key={cat.id}
                className={`saree-category-pill-item ${isCategoryActive(cat.id) ? 'is-active-pill' : ''}`}
                onClick={() => setCurrentIndex(getPillTargetIndex(cat.id))}
                role="button"
                tabIndex={0}
                aria-label={`View ${cat.label}`}
              >
                <div className="saree-category-pill-icon">
                  {cat.icon}
                </div>
                <span className="saree-category-pill-title">{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Call-to-Action Group */}
          <div className="saree-hero-actions-group">
            <button
              type="button"
              className="saree-cta-primary-btn"
              onClick={() => {
                const el = document.getElementById('collection-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>EXPLORE COLLECTION</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <a
              href="#view-all"
              className="saree-cta-secondary-link"
              onClick={(e) => e.preventDefault()}
            >
              <span>View All Sarees</span>
              <span className="saree-link-arrow">&rarr;</span>
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="saree-trust-indicators">
            <div className="saree-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Pure Silk Mark</span>
            </div>
            <div className="saree-trust-separator" />
            <div className="saree-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="saree-trust-separator" />
            <div className="saree-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <span>Worldwide Delivery</span>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: CAROUSEL (Approx 55% Desktop)
            ========================================= */}
        <div
          className="saree-hero-carousel-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-roledescription="carousel"
        >
          {/* Subtle Blurred Fabric Backdrop for Depth & Luxury Showroom Atmosphere */}
          <div className="saree-backdrop-fabric-wrapper" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=1200&q=80"
              alt="Blurred silk fabric background"
              className="saree-backdrop-fabric-img"
            />
            <div className="saree-backdrop-fabric-overlay" />
          </div>

          {/* Horizontal Layered 9:16 Showcase Carousel Stage */}
          <div className="saree-carousel-stage">
            {sarees.map((saree, index) => {
              const cardStyle = getCardStyle(index);
              const isMain = index === currentIndex;

              return (
                <div
                  key={saree.id}
                  className={`saree-carousel-card ${isMain ? 'is-active-main' : 'is-stacked-card'}`}
                  style={cardStyle}
                  onClick={() => {
                    if (!isMain) setCurrentIndex(index);
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${saree.title} - ${saree.subtitle}`}
                  aria-hidden={!isMain}
                >
                  <div className="saree-card-inner">
                    {/* Realistic 9:16 Photography */}
                    <img
                      src={saree.image}
                      alt={saree.title}
                      className="saree-card-image"
                      loading={index <= 2 ? 'eager' : 'lazy'}
                    />

                    {/* Elegant Luxury Gold Hairline Bezel */}
                    <div className="saree-card-gold-border" />

                    {/* Top Right Fabric Tag Badge */}
                    <div className="saree-card-badge">
                      <span>{saree.tag}</span>
                    </div>

                    {/* Main Showcase Overlay Controls: Video Style Play Badge */}
                    {isMain && (
                      <button
                        type="button"
                        className={`saree-card-play-btn ${isPlaying ? 'is-playing' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(!isPlaying);
                        }}
                        aria-label="Preview saree drape video"
                      >
                        <div className="saree-play-btn-circle">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </div>
                      </button>
                    )}

                    {/* Bottom Luxury Product Details Card Overlay */}
                    <div className="saree-card-bottom-info">
                      <div className="saree-card-info-header">
                        <span className="saree-card-title">{saree.title}</span>
                        <span className="saree-card-duration">{saree.duration}</span>
                      </div>
                      <p className="saree-card-subtitle">{saree.subtitle}</p>

                      {/* Video Progress Bar for Showroom Reels Look */}
                      <div className="saree-video-progress-track">
                        <div className="saree-video-progress-fill" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal Frosted Glass Carousel Navigation Controls */}
          <div className="saree-carousel-controls-bar">
            {/* Left Prev Arrow Button */}
            <button
              type="button"
              className="saree-nav-arrow-btn saree-nav-arrow-prev"
              onClick={handlePrev}
              aria-label="Previous Saree"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Pagination Indicator Dots */}
            <div className="saree-pagination-dots" role="tablist" aria-label="Saree Slides">
              {sarees.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === currentIndex}
                  aria-label={`Go to ${item.title}`}
                  className={`saree-dot-btn ${dotIndex === currentIndex ? 'is-active-dot' : ''}`}
                  onClick={() => setCurrentIndex(dotIndex)}
                />
              ))}
            </div>

            {/* Right Next Arrow Button */}
            <button
              type="button"
              className="saree-nav-arrow-btn saree-nav-arrow-next"
              onClick={handleNext}
              aria-label="Next Saree"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
