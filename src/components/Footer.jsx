import React from 'react';
import logoImg from '../assets/logo_2.png';
import './components.css';

const Footer = ({ onNavigate = () => {} }) => {
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Our Collections', href: '#our-collections' },
    { label: 'Embroidery Designs', href: '#our-blouse-collection' },
    { label: 'Latest Collections', href: '#latest-collections' },
    { label: 'Customer Reviews', href: '#customer-reviews' },
    { label: 'Contact Us', href: '#contact-us' }
  ];

  const weaveCategories = [
    { label: 'Kanchipuram Pattu', href: '#our-collections' },
    { label: 'Royal Dola Silk', href: '#our-collections' },
    { label: 'Artisan Handlooms', href: '#our-collections' },
    { label: 'Computer Work Blouses', href: '#our-blouse-collection' },
    { label: 'Custom Tailoring & Stitching', href: '#our-blouse-collection' }
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === '#about-us') {
      onNavigate('about');
      return;
    }
    if (href === '#contact-us') {
      onNavigate('contact');
      return;
    }
    onNavigate('home', href);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <footer id="site-footer" className="luxury-footer" aria-label="Site Footer">
      {/* Decorative Golden Seam Top Border */}
      <div className="footer-top-ornament">
        <div className="footer-seam-line" />
        <span className="footer-seam-diamond">✦ శ్రీదేవి కలెక్షన్స్ ✦</span>
        <div className="footer-seam-line" />
      </div>

      <div className="footer-container">
        {/* 4 Responsive Columns Layout with col-lg-4 styling */}
        <div className="footer-grid row">
          {/* Column 1: Brand & Heritage */}
          <div className="footer-col col-lg-4 col-brand">
            <div className="footer-logo-wrap">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, '#home')}
                className="footer-logo-card"
                aria-label="Sridevi Sarees Homepage"
              >
                <img src={logoImg} alt="Sridevi Sarees & Collections" className="footer-logo" />
              </a>
            </div>
            <p className="footer-about-text">
              Curators of authentic handloom silk sarees and precision computer embroidery blouses. Weaving royalty and auspicious traditions for Telugu celebrations across generations.
            </p>
            <div className="footer-badge-pill">
              <span className="badge-sparkle">✦</span>
              <span>100% Silk Mark Certified Weaves</span>
            </div>
          </div>

          {/* Column 2: Navigation Links (Navbar Components) */}
          <div className="footer-col col-lg-4 col-nav">
            <h3 className="footer-col-title">
              <span>EXPLORE</span>
              <span className="title-underline" />
            </h3>
            <ul className="footer-links-list">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="footer-link"
                  >
                    <span className="footer-link-bullet">&rarr;</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Handloom & Embroidery Specialities */}
          <div className="footer-col col-lg-4 col-specialities">
            <h3 className="footer-col-title">
              <span>COLLECTIONS</span>
              <span className="title-underline" />
            </h3>
            <ul className="footer-links-list">
              {weaveCategories.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="footer-link"
                  >
                    <span className="footer-link-bullet">&rarr;</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Exact Store Visit Details */}
          <div className="footer-col col-lg-4 col-contact">
            <h3 className="footer-col-title">
              <span>VISIT OUR STORE</span>
              <span className="title-underline" />
            </h3>

            <div className="footer-contact-items">
              {/* Phone / Mobile */}
              <a href="tel:+919849837338" className="footer-contact-entry">
                <div className="contact-entry-icon phone-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-entry-text">
                  <span className="entry-label">Call / WhatsApp:</span>
                  <span className="entry-value highlight">+91 9849837338</span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:sridevicollections1644@gmail.com" className="footer-contact-entry">
                <div className="contact-entry-icon mail-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-entry-text">
                  <span className="entry-label">Email Us:</span>
                  <span className="entry-value">sridevicollections1644@gmail.com</span>
                </div>
              </a>

              {/* Location Address */}
              <div className="footer-contact-entry">
                <div className="contact-entry-icon pin-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-entry-text">
                  <span className="entry-label">Store Location:</span>
                  <span className="entry-value address-value">
                    near sai baba temple kovour road kandukur 523105
                  </span>
                </div>
              </div>

              {/* Google Maps Button */}
              <a
                href="https://maps.app.goo.gl/61RjLJAiZmDNpHiY7"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-maps-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <span>Open in Google Maps</span>
                <span className="maps-arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Designer Strip */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p className="copyright-text">
              © {new Date().getFullYear()} <strong>Sridevi Sarees &amp; Collections</strong>. All Rights Reserved.
            </p>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-credit-box">
              <span className="credit-lead">Designed and Maintained by</span>
              <strong className="credit-author">"Bezawada Surendra Nath"</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
