import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SareeHero from './components/SareeHero';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ContactUs from './components/ContactUs';
import AdminLogin from './admindashboard/AdminLogin';
import AdminDashboard from './admindashboard/AdminDashboard';
import silkBanner from './assets/silk-sarees-banner1.png';
import pattuBanner from './assets/pattu-saree-banner1.png';
import designerBanner from './assets/desginer_sarees-banner1.png';
import handloomBanner from './assets/handloom-sarees-banner1.jpg';
import sareeNavyBlue from './assets/collections/saree_navy_blue.jpg';
import sareeDustyPlum from './assets/collections/saree_dusty_plum.jpg';
import sareeEmeraldGreen from './assets/collections/saree_emerald_green.jpg';
import sareeRoyalBlue from './assets/collections/saree_royal_blue.jpg';
import modelNavyBlue from './assets/collections/model_navy_blue.jpg';
import modelDustyPlum from './assets/collections/model_dusty_plum.jpg';
import modelEmeraldGreen from './assets/collections/model_emerald_green.jpg';
import modelRoyalBlue from './assets/collections/model_royal_blue.jpg';
import weddingImg from './assets/occasions/wedding.jpg';
import sankrantiImg from './assets/occasions/sankranti.jpg';
import lakshmiPoojaImg from './assets/occasions/lakshmi-pooja.jpg';
import navaratriImg from './assets/occasions/navaratri.jpg';
import ugadiImg from './assets/occasions/Udagi.png';
import diwaliImg from './assets/occasions/diwali.jpg';
import blouseMaroon from './assets/blouses/blouse_maroon_gold.jpg';
import blouseEmerald from './assets/blouses/blouse_emerald_peacock.jpg';
import blouseRaniPink from './assets/blouses/blouse_rani_pink.jpg';
import blouseRoyalBlue from './assets/blouses/blouse_royal_blue.jpg';
import blouseWinePurple from './assets/blouses/blouse_wine_purple.jpg';
import blouseMustardGold from './assets/blouses/blouse_mustard_gold.jpg';
import blouseDeepTeal from './assets/blouses/blouse_deep_teal.jpg';
import './App.css';

const blouseCategories = ['All Designs', 'Bridal Heavy', 'Keyhole & Back', 'Peacock Motifs', 'Temple Borders'];

const blouseCollection = [
  {
    id: 'blouse-rani-pink',
    title: 'Bridal Rani Pink Heavy Computer Work Blouse',
    category: 'Bridal Heavy',
    price: '₹2,200.00',
    originalPrice: '₹3,500.00',
    fabric: 'Pure Raw Silk • Gold & Silver Zari',
    work: 'Precision Computerized Paisley Jall & Heavy Sleeve Border with Tassels',
    image: blouseRaniPink,
    tag: 'Bridal Masterpiece'
  },
  {
    id: 'blouse-maroon-gold',
    title: 'Royal Maroon Peacock Computer Work Blouse',
    category: 'Peacock Motifs',
    price: '₹1,850.00',
    originalPrice: '₹2,800.00',
    fabric: 'Crimson Raw Silk • Antique Gold Zari',
    work: 'Computerized U-Neck Peacock & Mango Buttis',
    image: blouseMaroon,
    tag: 'Bestseller'
  },
  {
    id: 'blouse-emerald-peacock',
    title: 'Emerald Green Keyhole Back Computer Work',
    category: 'Keyhole & Back',
    price: '₹1,650.00',
    originalPrice: '₹2,500.00',
    fabric: 'Pure Silk • Golden Threadwork',
    work: 'Computer Keyhole Back & Dual Peacock Borders',
    image: blouseEmerald,
    tag: 'Festive Classic'
  },
  {
    id: 'blouse-royal-blue',
    title: 'Royal Blue Paisley Computer Embroidery Blouse',
    category: 'Keyhole & Back',
    price: '₹1,750.00',
    originalPrice: '₹2,600.00',
    fabric: 'Mulberry Silk • Silver Zari Filigree',
    work: 'Floral Computerized Brocade & Leaf Medallions',
    image: blouseRoyalBlue,
    tag: 'Trending'
  },
  {
    id: 'blouse-wine-purple',
    title: 'Regal Wine Plum Lotus Computer Work Blouse',
    category: 'Peacock Motifs',
    price: '₹1,900.00',
    originalPrice: '₹2,900.00',
    fabric: 'Heritage Silk • Antique Zari Work',
    work: 'Lotus Bloom Computer Embroidery on Neck & Arms',
    image: blouseWinePurple,
    tag: 'Exclusive'
  },
  {
    id: 'blouse-mustard-gold',
    title: 'Mustard Gold Temple Border Computer Blouse',
    category: 'Temple Borders',
    price: '₹1,550.00',
    originalPrice: '₹2,400.00',
    fabric: 'Fine Silk • Magenta Zari Trims',
    work: 'Temple Gopuram Computer Needlework',
    image: blouseMustardGold,
    tag: 'Auspicious'
  },
  {
    id: 'blouse-deep-teal',
    title: 'Deep Teal Blossom Computer Work Blouse',
    category: 'Bridal Heavy',
    price: '₹1,800.00',
    originalPrice: '₹2,700.00',
    fabric: 'Dupion Silk • Multi-Zari Stitch',
    work: 'All-Over Floral Computer Embroidery & Tassels',
    image: blouseDeepTeal,
    tag: 'New Arrival'
  }
];

const customerReviews = [
  {
    id: 1,
    name: 'Pruthvi Edara',
    initials: 'PE',
    rating: 5,
    tag: 'Saree Quality',
    location: 'Verified Buyer',
    text: "I've got few sarees from them and I'm truly impressed! The quality is simply amazing. If you're looking for latest, high-quality sarees, I highly recommend them."
  },
  {
    id: 2,
    name: 'Harini Pavuluri',
    initials: 'HP',
    rating: 5,
    tag: 'Finishing & Computer Work',
    location: 'Verified Buyer',
    text: "Sridevi Saree Collection has a great collection with good finishing and computer embroidery work."
  },
  {
    id: 3,
    name: 'Punatilakshmi Bhavya',
    initials: 'PB',
    rating: 5,
    tag: 'Computer Embroidery Work',
    location: 'Verified Buyer',
    text: "Great collection and excellent finishing computer embroidery work."
  },
  {
    id: 4,
    name: 'Devi Sri Hruthik',
    initials: 'DH',
    rating: 5,
    tag: 'Weddings & Festivals',
    location: 'Verified Buyer',
    text: "Absolutely loved the collection of sarees! The quality, designs, and colors are beautiful, and the pricing is reasonable. The service was friendly and professional, making the entire shopping experience smooth and enjoyable. I highly recommend this store to anyone looking for elegant sarees for weddings, festivals, or any special occasion. Wishing the business continued success!"
  },
  {
    id: 5,
    name: 'Pranith M',
    initials: 'PM',
    rating: 5,
    tag: 'High-Quality Sarees & Blouses',
    location: 'Verified Buyer',
    text: "Recently visited Sridevi Sarees Collection. They have an excellent collection of high-quality sarees with beautiful computer blouse work designs. The sarees are elegant, trendy, and available in a variety of patterns and colors. The quality of the fabric and the finishing of the blouse work are impressive. A great place for anyone looking for stylish and premium sarees for special occasions. Highly recommended!"
  },
  {
    id: 6,
    name: 'Veera Reddy',
    initials: 'VR',
    rating: 5,
    tag: 'Punctual Delivery & Service',
    location: 'Verified Buyer',
    text: "Excellent collection of sarees with good quality and reasonable prices. The computer blouse work was done perfectly and delivered on time. Very satisfied with the service. Highly recommended!"
  }
];

const ourCollections = [
  {
    id: 'navy-blue-silver-zari',
    name: 'Navy Blue Silver Zari Woven Saree',
    price: '₹1,750.00',
    sareeImg: sareeNavyBlue,
    modelImg: modelNavyBlue
  },
  {
    id: 'dusty-plum-elephant-motif',
    name: 'Dusty Plum Elephant Motif Zari Saree',
    price: '₹1,050.00',
    sareeImg: sareeDustyPlum,
    modelImg: modelDustyPlum
  },
  {
    id: 'emerald-green-navy-blue',
    name: 'Emerald Green & Navy Blue Zari Saree',
    price: '₹1,150.00',
    sareeImg: sareeEmeraldGreen,
    modelImg: modelEmeraldGreen
  },
  {
    id: 'royal-blue-sky-blue',
    name: 'Royal Blue & Sky Blue Zari Woven Saree',
    price: '₹1,200.00',
    sareeImg: sareeRoyalBlue,
    modelImg: modelRoyalBlue
  }
  
];

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

const occasions = [
  {
    id: 'marriage-function',
    title: 'Marriage Sarees',
    tag: 'Bridal Heritage',
    sub: 'Kanchipuram & Wedding Pattu',
    image: weddingImg,
    fallback: pattuBanner
  },
  {
    id: 'sankranti',
    title: 'Sankranti',
    tag: 'Pedda Panduga',
    sub: 'Gadwal & Festive Handlooms',
    image: sankrantiImg,
    fallback: silkBanner
  },
  {
    id: 'varalakshmi-vratham',
    title: 'Varalakshmi Vratham',
    tag: 'Auspicious Pooja',
    sub: 'Temple Borders & Pure Pattu',
    image: lakshmiPoojaImg,
    fallback: designerBanner
  },
  {
    id: 'dasara-bathukamma',
    title: 'Dasara & Bathukamma',
    tag: 'Navaratri Splendor',
    sub: 'Pochampally & Ikkat Silks',
    image: navaratriImg,
    fallback: handloomBanner
  },
  {
    id: 'ugadi',
    title: 'Ugadi',
    tag: 'Telugu New Year',
    sub: 'Dharmavaram & Dola Silk',
    image: ugadiImg,
    fallback: silkBanner
  },
  {
    id: 'diwali',
    title: 'Diwali',
    tag: 'Deepavali Splendor',
    sub: 'Party & Shimmering Silks',
    image: diwaliImg,
    fallback: pattuBanner
  }
];

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    if (hash === '#admin-login' || hash === '#/admin-login' || hash === '#admin' || path === '/admin-login' || path === '/admin') return 'admin-login';
    if (hash === '#admin-dashboard' || hash === '#/admin-dashboard' || hash === '#dashboard' || path === '/admin-dashboard' || path === '/dashboard') return 'admin-dashboard';
    if (hash === '#about-us' || hash === '#/about-us' || hash === '#about' || path === '/about-us' || path === '/about') return 'about';
    if (hash === '#contact-us' || hash === '#/contact-us' || hash === '#contact' || path === '/contact-us' || path === '/contact') return 'contact';
    return 'home';
  });
  const [selectedDrapeId, setSelectedDrapeId] = useState('pattu');
  const [isInView, setIsInView] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [touchActiveId, setTouchActiveId] = useState(null);
  const [selectedBlouseCat, setSelectedBlouseCat] = useState('All Designs');
  const aboutRef = useRef(null);
  const occasionScrollRef = useRef(null);
  const isOccasionPaused = useRef(false);
  const reviewsScrollRef = useRef(null);
  const isReviewsPaused = useRef(false);
  const activeDrape = featuredDrapes.find((d) => d.id === selectedDrapeId) || featuredDrapes[0];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      if (hash === '#admin-login' || hash === '#/admin-login' || hash === '#admin' || path === '/admin-login' || path === '/admin') {
        setCurrentView('admin-login');
      } else if (hash === '#admin-dashboard' || hash === '#/admin-dashboard' || hash === '#dashboard' || path === '/admin-dashboard' || path === '/dashboard') {
        setCurrentView('admin-dashboard');
      } else if (hash === '#about-us' || hash === '#/about-us' || hash === '#about' || path === '/about-us' || path === '/about') {
        setCurrentView('about');
      } else if (hash === '#contact-us' || hash === '#/contact-us' || hash === '#contact' || path === '/contact-us' || path === '/contact') {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigate = (view, targetHref = null) => {
    if (view === 'about') {
      setCurrentView('about');
      window.location.hash = '#about-us';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'contact') {
      setCurrentView('contact');
      window.location.hash = '#contact-us';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      if (targetHref && targetHref !== '#home') {
        window.location.hash = targetHref;
        setTimeout(() => {
          const el = document.querySelector(targetHref);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.location.hash = '#home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOccasionScroll = (direction) => {
    if (!occasionScrollRef.current) return;
    const container = occasionScrollRef.current;
    const firstCard = container.querySelector('.occasion-card');
    const scrollDelta = firstCard ? firstCard.offsetWidth + 16 : 280;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'next') {
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollDelta, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollDelta, behavior: 'smooth' });
      }
    }
  };

  // Auto-scroll Occasion cards from right to left continuously
  useEffect(() => {
    const container = occasionScrollRef.current;
    if (!container) return;

    const intervalId = setInterval(() => {
      if (isOccasionPaused.current) return;

      const firstCard = container.querySelector('.occasion-card');
      const scrollDelta = firstCard ? firstCard.offsetWidth + 16 : 280;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollDelta, behavior: 'smooth' });
      }
    }, 2800);

    return () => clearInterval(intervalId);
  }, []);

  const handleReviewsScroll = (direction) => {
    if (!reviewsScrollRef.current) return;
    const container = reviewsScrollRef.current;
    const firstCard = container.querySelector('.review-card');
    const scrollDelta = firstCard ? firstCard.offsetWidth + 24 : 380;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'next') {
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollDelta, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollDelta, behavior: 'smooth' });
      }
    }
  };

  // Automatic right-to-left sliding animation for customer reviews
  useEffect(() => {
    const container = reviewsScrollRef.current;
    if (!container) return;

    const intervalId = setInterval(() => {
      if (isReviewsPaused.current) return;

      const firstCard = container.querySelector('.review-card');
      const scrollDelta = firstCard ? firstCard.offsetWidth + 24 : 380;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollDelta, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setIsInView(true);
  }, []);

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'admin-login') {
    return <AdminLogin />;
  }

  if (currentView === 'admin-dashboard') {
    return <AdminDashboard />;
  }

  return (
    <div className="app-container">
      {/* Sticky & Transparent Header with Centered Logo & Action Icons */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* View Switcher: About Us Page vs Contact Us Page vs Home Luxury Showcase */}
      {currentView === 'about' ? (
        <AboutPage onNavigate={handleNavigate} />
      ) : currentView === 'contact' ? (
        <ContactUs onNavigate={handleNavigate} />
      ) : (
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
                  <span className="about-stat-num">5+</span>
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

        {/* =========================================================
            SHOP BY OCCASION SECTION (AFTER ABOUT US)
            ========================================================= */}
        <section id="latest-collections" className="occasion-section" aria-label="Shop by Occasion">
          <div className="occasion-ambient-glow" aria-hidden="true" />

          <div className="occasion-container">
            {/* Centered Luxury Telugu Saree Showcase Header */}
            <div className="occasion-header">
              <div className="occasion-eyebrow-wrap">
                <span className="occasion-accent-ornament">✦</span>
                <span className="occasion-eyebrow">SHOP BY OCCASION • శుభ సందర్భాలు</span>
                <span className="occasion-accent-ornament">✦</span>
              </div>
              <h2 className="occasion-title">
                AUSPICIOUS WEAVES FOR EVERY CELEBRATION
              </h2>
              <p className="occasion-subtitle">
                From grand South Indian marriage functions to sacred Telugu festivities, drape yourself in authentic handloom royalty.
              </p>
            </div>

            {/* Slider Showcase with Sliding Effect & Navigation */}
            <div
              className="occasion-slider-wrap"
              onMouseEnter={() => { isOccasionPaused.current = true; }}
              onMouseLeave={() => { isOccasionPaused.current = false; }}
              onTouchStart={() => { isOccasionPaused.current = true; }}
              onTouchEnd={() => { isOccasionPaused.current = false; }}
            >
              {/* Prev Slide Control */}
              <button
                type="button"
                className="occasion-nav-btn occasion-nav-prev"
                onClick={() => handleOccasionScroll('prev')}
                aria-label="Previous occasion"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Scroll Track */}
              <div
                className="occasion-track"
                ref={occasionScrollRef}
              >
                {occasions.map((item) => (
                  <div key={item.id} className="occasion-card">
                    <div className="occasion-card-inner">
                      {/* Top Saree Fabric / Occasion Badge */}
                      <div className="occasion-top-badge">
                        <span>{item.tag}</span>
                      </div>

                      <img
                        src={item.image}
                        alt={item.title}
                        className="occasion-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = item.fallback;
                        }}
                      />
                      <div className="occasion-card-gradient" />
                      
                      <div className="occasion-card-content">
                        <h3 className="occasion-card-title">{item.title}</h3>
                        <p className="occasion-card-sub">{item.sub}</p>
                        <button
                          type="button"
                          className="occasion-shop-btn"
                          onClick={() => {
                            const el = document.getElementById('collection-anchor');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <span>SHOP NOW</span>
                          <span className="occasion-btn-arrow">&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Slide Control */}
              <button
                type="button"
                className="occasion-nav-btn occasion-nav-next"
                onClick={() => handleOccasionScroll('next')}
                aria-label="Next occasion"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            OUR COLLECTIONS SECTION (HOVER TO REVEAL MODEL DRAPE)
            ========================================================= */}
        <section id="our-collections" className="our-collections-section" aria-label="Our Collections">
          <div className="collections-container">
            {/* Section Header */}
            <div className="collections-header">
              <div className="collections-eyebrow-wrap">
                <span className="collections-ornament">✦</span>
                <span className="collections-eyebrow">EXCLUSIVE WEAVES • మన కలెక్షన్స్</span>
                <span className="collections-ornament">✦</span>
              </div>
              <h2 className="collections-title">OUR COLLECTIONS</h2>
              <p className="collections-subtitle">
                Authentic silk sarees woven with pure zari artistry. Hover over any saree to see how it elegantly drapes.
              </p>
            </div>

            {/* Responsive Saree Product Grid */}
            <div className="collections-grid">
              {ourCollections.map((item) => {
                const isFavorited = !!wishlist[item.id];
                const isTouchActive = touchActiveId === item.id;

                return (
                  <article
                    key={item.id}
                    className={`collection-card ${isTouchActive ? 'touch-active' : ''}`}
                    onClick={() => setTouchActiveId(touchActiveId === item.id ? null : item.id)}
                  >
                    {/* Media Container with Saree -> Model Hover Swap */}
                    <div className="collection-media-box">
                      {/* 1. Saree Only (Shown initially) */}
                      <img
                        src={item.sareeImg}
                        alt={item.name}
                        className="collection-img saree-only-img"
                        loading="lazy"
                      />

                      {/* 2. Female Model Wearing the Saree (Shown on hover) */}
                      <img
                        src={item.modelImg}
                        alt={`${item.name} draped on model`}
                        className="collection-img model-wearing-img"
                        loading="lazy"
                      />

                      {/* Floating Action Icons: Wishlist Heart & Bag */}
                      <div className="collection-card-actions">
                        <button
                          type="button"
                          className={`card-action-btn ${isFavorited ? 'is-favorited' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item.id);
                          }}
                          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          title={isFavorited ? 'Added to Wishlist' : 'Add to Wishlist'}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={isFavorited ? '#e11d48' : 'none'}
                            stroke={isFavorited ? '#e11d48' : '#2b0c1e'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="card-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          aria-label="Add to Bag"
                          title="Add to Bag"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2b0c1e"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </button>
                      </div>

                      {/* Subtle Hover/Tap Indicator */}
                      <div className="collection-drape-indicator">
                        <span>Hover for drape</span>
                      </div>
                    </div>

                    {/* Saree Details matching reference photo */}
                    <div className="collection-card-details">
                      <h3 className="collection-saree-title" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="collection-price-wrap">
                        <span className="price-as-low">As low as</span>
                        <span className="price-amount">{item.price}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            OUR BLOUSE COLLECTION SECTION (COMPUTER WORK ON TABLE)
            ========================================================= */}
        <section id="our-blouse-collection" className="blouse-section" aria-label="Our Blouse Collection">
          <div className="blouse-container">
            {/* Header with Title, Telugu Script & Description */}
            <div className="blouse-header">
              <div className="blouse-eyebrow-wrap">
                <span className="blouse-ornament">✦</span>
                <span className="blouse-eyebrow">PRECISION COMPUTER WORK • కంప్యూటర్ వర్క్ బ్లౌజులు</span>
                <span className="blouse-ornament">✦</span>
              </div>
              <h2 className="blouse-title">OUR BLOUSE COLLECTION</h2>
              <p className="blouse-subtitle">
                Mastercrafted computerized embroidery on handpicked pure silk fabrics. Laid flat on artisan tables to showcase finished zari needlework, back neck arches, and sleeve craftsmanship.
              </p>

              {/* Category Filter Tabs */}
              <div className="blouse-filter-bar" role="tablist">
                {blouseCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selectedBlouseCat === cat}
                    className={`blouse-filter-btn ${selectedBlouseCat === cat ? 'active' : ''}`}
                    onClick={() => setSelectedBlouseCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Distinctive Responsive Layout: Spotlight Showcase + Gallery */}
            <div className="blouse-showcase-layout">
              {/* Left Column: Spotlight Masterpiece (Bridal Rani Pink) */}
              {selectedBlouseCat === 'All Designs' && (
                <div className="blouse-spotlight-col">
                  <div className="blouse-spotlight-card">
                    <div className="blouse-spotlight-badge">
                      <span>★ Bridal Computer Work Spotlight</span>
                    </div>

                    <div className="blouse-spotlight-img-wrap">
                      <img
                        src={blouseCollection[0].image}
                        alt={blouseCollection[0].title}
                        className="blouse-spotlight-img"
                        loading="lazy"
                      />
                      <span className="blouse-table-pill">Flat Lay Studio Display</span>
                    </div>

                    <div className="blouse-spotlight-info">
                      <div className="blouse-tags-row">
                        <span className="blouse-pill">{blouseCollection[0].fabric}</span>
                        <span className="blouse-pill highlight">Custom Fit Available</span>
                      </div>
                      <h3 className="blouse-spotlight-title">{blouseCollection[0].title}</h3>
                      <p className="blouse-spotlight-desc">{blouseCollection[0].work}</p>

                      <div className="blouse-spotlight-footer">
                        <div className="blouse-spotlight-price">
                          <span className="price-tag-now">{blouseCollection[0].price}</span>
                          <span className="price-tag-was">{blouseCollection[0].originalPrice}</span>
                        </div>
                        <a
                          href="https://wa.me/919849837338?text=Hello%20Sridevi%20Sarees,%20I%20am%20interested%20in%20Bridal%20Rani%20Pink%20Heavy%20Computer%20Work%20Blouse"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blouse-whatsapp-btn"
                        >
                          <span>Enquire on WhatsApp</span>
                          <span className="blouse-arrow-icon">&rarr;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column / Grid: Companion Finished Blouses */}
              <div className={`blouse-cards-grid ${selectedBlouseCat !== 'All Designs' ? 'full-grid' : ''}`}>
                {(selectedBlouseCat === 'All Designs' ? blouseCollection.slice(1) : (
                  blouseCollection.filter((b) => b.category === selectedBlouseCat)
                )).map((item) => (
                  <article key={item.id} className="blouse-item-card">
                    <div className="blouse-card-badge">
                      <span>{item.tag}</span>
                    </div>

                    {/* Only the Blouse on the Table (NO female model, NO hover swap) */}
                    <div className="blouse-media-frame">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="blouse-table-photo"
                        loading="lazy"
                      />
                      <div className="blouse-finish-chip">
                        <span>Completed Computer Work</span>
                      </div>
                    </div>

                    <div className="blouse-card-info">
                      <span className="blouse-cat-tag">{item.category}</span>
                      <h4 className="blouse-item-name" title={item.title}>{item.title}</h4>
                      <p className="blouse-item-fabric">{item.fabric}</p>

                      <div className="blouse-card-bottom">
                        <div className="blouse-price-cluster">
                          <span className="current-price">{item.price}</span>
                          <span className="was-price">{item.originalPrice}</span>
                        </div>
                        <a
                          href="tel:+919849837338"
                          className="blouse-quick-book-btn"
                          title="Call to book stitching"
                        >
                          Book Stitch
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Custom Tailoring & Embroidery Assistance Ribbon */}
            <div className="blouse-tailoring-strip">
              <div className="tailoring-strip-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="tailoring-strip-content">
                <strong>Need Custom Neckline or Sleeve Computer Work on Your Own Saree Blouse?</strong>
                <p>We provide precision computerized embroidery designing with custom size tailoring and fast 48-hour dispatch.</p>
              </div>
              <a href="tel:+919849837338" className="tailoring-strip-btn">
                <span>Call Designer</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            CUSTOMER REVIEWS SECTION ("The real voices from the happy faces")
            ========================================================= */}
        <section id="customer-reviews" className="reviews-section" aria-label="Customer Reviews">
          <div className="reviews-container">
            {/* Header with requested Tagline */}
            <div className="reviews-header">
              <div className="reviews-eyebrow-wrap">
                <span className="reviews-ornament">✦</span>
                <span className="reviews-eyebrow">CLIENT TESTIMONIALS • కస్టమర్ల అభిప్రాయాలు</span>
                <span className="reviews-ornament">✦</span>
              </div>
              <p className="reviews-tagline">"The real voices from the happy faces"</p>
              <h2 className="reviews-title">LOVE FROM OUR PATRONS</h2>
              <div className="reviews-rating-pill">
                <span className="stars">★★★★★</span>
                <span className="rating-score">4.9 / 5.0</span>
                <span className="rating-divider">•</span>
                <span className="verified-text">Verified Customer Reviews</span>
              </div>
            </div>

            {/* Single Row Sliding Track with Controls */}
            <div
              className="reviews-slider-wrap"
              onMouseEnter={() => { isReviewsPaused.current = true; }}
              onMouseLeave={() => { isReviewsPaused.current = false; }}
              onTouchStart={() => { isReviewsPaused.current = true; }}
              onTouchEnd={() => { isReviewsPaused.current = false; }}
            >
              {/* Prev Navigation Button */}
              <button
                type="button"
                className="reviews-nav-btn reviews-nav-prev"
                onClick={() => handleReviewsScroll('prev')}
                aria-label="Previous review"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Single Row Sliding Track */}
              <div className="reviews-slider-track" ref={reviewsScrollRef}>
                {customerReviews.map((rev) => (
                  <article key={rev.id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-stars-wrap">
                        <div className="review-stars" aria-label="5 out of 5 stars">
                          {'★'.repeat(rev.rating)}
                        </div>
                        <span className="review-card-tag">{rev.tag}</span>
                      </div>
                      <div className="review-quote-icon" aria-hidden="true">
                        “
                      </div>
                    </div>

                    <div className="review-text-wrap">
                      <blockquote className="review-text">
                        "{rev.text}"
                      </blockquote>
                    </div>

                    <div className="reviewer-profile">
                      <div className="reviewer-avatar">
                        <span>{rev.initials}</span>
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{rev.name}</h4>
                        <div className="reviewer-badge-row">
                          <span className="verified-check">✓</span>
                          <span className="reviewer-status">{rev.location}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Next Navigation Button */}
              <button
                type="button"
                className="reviews-nav-btn reviews-nav-next"
                onClick={() => handleReviewsScroll('next')}
                aria-label="Next review"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* Luxury 4-Column Footer Section */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
export default App;
