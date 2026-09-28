import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo_2.png';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNavItems = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Our Collections', href: '#our-collections' },
  ];

  const rightNavItems = [
    { label: 'Embroidery Designs', href: '#embroidery-designs' },
    { label: 'Latest Collections', href: '#latest-collections' },
    { label: 'Contact Us', href: '#contact-us' },
  ];

  const allNavItems = [...leftNavItems, ...rightNavItems];

  const handleNavClick = (label, href) => {
    setActiveItem(label);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`premium-navbar-wrapper sticky-header ${
        isScrolled ? 'is-scrolled' : 'is-transparent'
      }`}
    >
      {/* Top Marquee Announcement Bar */}
      <div className="top-marquee-bar">
        <marquee
          direction="left"
          scrollamount="5"
          behavior="scroll"
          onMouseOver={(e) => e.target.stop && e.target.stop()}
          onMouseOut={(e) => e.target.start && e.target.start()}
        >
          <div className="marquee-content-flex">
            <span className="marquee-item">
              <svg
                className="marquee-animated-icon sparkle-rotate"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="marquee-title-name">Sridevi Sarees Collections</span>
            </span>

            <span className="marquee-divider" aria-hidden="true">✦</span>

            <span className="marquee-item">
              <svg
                className="marquee-animated-icon phone-pulse"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="marquee-label">Mobile:</span>
              <span className="marquee-val">+91 98498 37338</span>
            </span>

            <span className="marquee-divider" aria-hidden="true">✦</span>

            <span className="marquee-item">
              <svg
                className="marquee-animated-icon pin-bounce"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="marquee-label">Address:</span>
              <span className="marquee-val">Near Sai Baba Temple, Kovur Road, Kandukur</span>
            </span>
          </div>
        </marquee>
      </div>

      {/* Delicate Golden Filament */}
      <div className="navbar-gold-filament" />

      {/* Main Navbar Container */}
      <div className="navbar-container">
        {/* Left 3 Headings (Desktop) */}
        <nav className="nav-side nav-left" aria-label="Left Navigation">
          <ul className="nav-links-list">
            {leftNavItems.map((item) => (
              <li key={item.label} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activeItem === item.label ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.label, item.href)}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <span className="nav-link-indicator" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Brand Logo (Desktop Center, Mobile Left) */}
        <div className="nav-center-logo">
          <a
            href="#home"
            className="logo-anchor"
            onClick={() => handleNavClick('Home', '#home')}
            aria-label="Sridevi Sarees Homepage"
          >
            <div className="logo-halo" />
            <img
              src={logoImg}
              alt="Sridevi Collections"
              className="navbar-logo-image"
            />
          </a>
        </div>

        {/* Right 3 Headings + Action Icons (Desktop) */}
        <nav className="nav-side nav-right" aria-label="Right Navigation">
          <ul className="nav-links-list">
            {rightNavItems.map((item) => (
              <li key={item.label} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activeItem === item.label ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.label, item.href)}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <span className="nav-link-indicator" />
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-action-icons">
            <span className="nav-action-divider" aria-hidden="true" />
            {/* Shopping Cart Icon */}
            <button
              type="button"
              className="nav-icon-btn cart-btn"
              aria-label={`Shopping Cart with ${cartCount} items`}
              title="Shopping Cart"
              onClick={() => setCartCount((prev) => (prev + 1) % 10)}
            >
              <svg
                className="nav-svg-icon"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Profile Icon */}
            <button
              type="button"
              className="nav-icon-btn profile-btn"
              aria-label="User Account Profile"
              title="My Account"
            >
              <svg
                className="nav-svg-icon"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Middle Action Icons (Cart & Profile - Center on Mobile) */}
        <div className="mobile-header-actions">
          {/* Shopping Cart Icon */}
          <button
            type="button"
            className="nav-icon-btn mobile-cart-btn"
            aria-label={`Shopping Cart with ${cartCount} items`}
            title="Shopping Cart"
            onClick={() => setCartCount((prev) => (prev + 1) % 10)}
          >
            <svg
              className="nav-svg-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Profile Icon */}
          <button
            type="button"
            className="nav-icon-btn mobile-profile-btn"
            aria-label="User Account Profile"
            title="My Account"
          >
            <svg
              className="nav-svg-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Bar Button (Right on Mobile) */}
        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line top" />
          <span className="hamburger-line mid" />
          <span className="hamburger-line bot" />
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-drawer-panel">
          <div className="mobile-drawer-header">
            <img src={logoImg} alt="Sridevi Collections" className="mobile-drawer-logo" />
            <button
              type="button"
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>

          <div className="mobile-drawer-gold-divider" />

          {/* Contact Info in Mobile Drawer */}
          <div className="mobile-drawer-contact-info">
            <div className="contact-info-row">
              <svg className="contact-icon phone-pulse" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 98498 37338</span>
            </div>
            <div className="contact-info-row">
              <svg className="contact-icon pin-bounce" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Near Sai Baba Temple, Kovur Road, Kandukur</span>
            </div>
          </div>

          <div className="mobile-drawer-gold-divider" />

          <ul className="mobile-drawer-list">
            {allNavItems.map((item, index) => (
              <li key={item.label} style={{ animationDelay: `${index * 0.05}s` }}>
                <a
                  href={item.href}
                  className={`mobile-drawer-link ${activeItem === item.label ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.label, item.href)}
                >
                  <span className="link-bullet">✦</span>
                  <span className="link-title">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Drawer Action Icons */}
          <div className="mobile-drawer-actions">
            <div className="mobile-actions-row">
              <button
                type="button"
                className="mobile-action-card"
                onClick={() => setCartCount((prev) => (prev + 1) % 10)}
              >
                <div className="mobile-card-icon-wrap">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
                </div>
                <span>Shopping Cart</span>
              </button>

              <button type="button" className="mobile-action-card">
                <div className="mobile-card-icon-wrap">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span>My Profile</span>
              </button>
            </div>
          </div>

          <div className="mobile-drawer-footer">
            <p className="heritage-tag">Pure Elegance &amp; Timeless Weaves</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
