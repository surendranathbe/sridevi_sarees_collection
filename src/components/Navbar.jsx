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
      {/* Delicate Golden Accent Filament */}
      <div className="navbar-gold-filament" />

      <div className="navbar-container">
        {/* Mobile Hamburger Toggle Button */}
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

        {/* Left Navigation Links */}
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

        {/* Center Brand Logo */}
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

        {/* Right Navigation Links & Action Icons */}
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

          {/* Action Icons: Cart & Profile (Directly after Contact Us) */}
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
                width="20"
                height="20"
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Header Quick Actions */}
        <div className="mobile-header-actions">
          <button
            type="button"
            className="nav-icon-btn mobile-cart-btn"
            aria-label="Shopping Cart"
            onClick={() => setCartCount((prev) => (prev + 1) % 10)}
          >
            <svg
              className="nav-svg-icon"
              width="20"
              height="20"
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
        </div>
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
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
