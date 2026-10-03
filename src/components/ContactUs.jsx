import React, { useState, useEffect } from 'react';
import heroBannerImg from '../assets/silk-sarees-banner1.png';
import showroomImg from '../assets/about-image-2.jpg';
import logoImg from '../assets/logo_2.png';
import {
  dispatchCustomerInquiry,
  generateWhatsAppMessage,
  generateGeneralWhatsAppMessage,
  OWNER_EMAIL
} from '../data/contactMailData';
import './components.css';

const ContactUs = ({ onNavigate = () => {} }) => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    service: 'Pure Silk Sarees',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // SEO Page Title & Scroll to top
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Contact Us | Sridevi Sarees & Collections Kandukur';

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Contact Sridevi Sarees & Collections in Kandukur, AP. Call/WhatsApp +91 9849837338. Near Sai Baba Temple, Kovur Road. Pure silks & computer embroidery blouses.'
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const snapshot = { ...formState };
    setSubmittedInfo(snapshot);

    // Dispatch the customer inquiry to owner mail sridevicollections1644@gmail.com with formatted table
    const result = await dispatchCustomerInquiry(snapshot);

    // Open mail client addressed to sridevicollections1644@gmail.com with structured table
    try {
      window.location.href = result.mailtoUrl;
    } catch (err) {
      console.log('Mail client dispatch:', err);
    }

    setIsSending(false);
    setIsSubmitted(true);

    // Reset the form fields while keeping the contact form displayed on the website
    setFormState({
      name: '',
      phone: '',
      service: 'Pure Silk Sarees',
      message: ''
    });

    // Auto-dismiss the success banner after 8 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 8000);
  };

  const handleWhatsAppInquiry = () => {
    const message = generateWhatsAppMessage(formState);
    window.open(`https://wa.me/919849837338?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="contact-page-wrapper" id="contact-page-top">
      {/* 1. Sub-banner Hero Section */}
      <section className="contact-hero-subbanner" aria-label="Contact Us Banner">
        <div className="contact-hero-bg-wrapper">
          <img
            src={heroBannerImg}
            alt="Sridevi Sarees Collections Heritage Banner"
            className="contact-hero-bg-image"
            loading="eager"
          />
          <div className="contact-hero-gradient-overlay" />
        </div>

        <div className="contact-hero-content-wrap">
          <span className="contact-hero-eyebrow">GET IN TOUCH • సంప్రదించండి</span>

          <h1 className="contact-hero-heading">
            Visit Our Showroom in Kandukur
          </h1>

          <div className="contact-hero-divider" aria-hidden="true">
            <span className="contact-divider-line" />
            <span className="contact-divider-diamond">✦ శ్రీదేవి కలెక్షన్స్ ✦</span>
            <span className="contact-divider-line" />
          </div>

          <nav className="contact-breadcrumb" aria-label="Breadcrumb">
            <button
              type="button"
              className="contact-breadcrumb-btn"
              onClick={() => onNavigate('home', '#home')}
            >
              Home
            </button>
            <span className="contact-breadcrumb-sep">/</span>
            <span className="contact-breadcrumb-curr" aria-current="page">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* 2. Primary 4 Contact Cards Grid (Direct from Footer Details) */}
      <section className="contact-cards-section" aria-label="Store Contact Details">
        <div className="contact-container">
          <div className="contact-cards-grid">
            {/* Card 1: Phone / Mobile / WhatsApp */}
            <article className="contact-info-card card-phone">
              <div className="card-top-icon-row">
                <div className="card-icon-badge phone-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="card-tag">DIRECT CALL &amp; WHATSAPP</span>
              </div>

              <h2 className="card-title">Call or WhatsApp</h2>
              <p className="card-main-val highlight-val">+91 9849837338</p>
              <p className="card-subtext">
                Speak directly with our store team for saree availability, price quotes, and custom blouse bookings.
              </p>

              <div className="card-actions-group">
                <a href="tel:+919849837338" className="cu-card-btn cu-btn-call">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call Now</span>
                  <span className="action-arrow">&rarr;</span>
                </a>
                <a
                  href={`https://wa.me/919849837338?text=${encodeURIComponent(generateGeneralWhatsAppMessage())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cu-card-btn cu-btn-whatsapp"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                  <span className="action-arrow">&rarr;</span>
                </a>
              </div>
            </article>

            {/* Card 2: Email */}
            <article className="contact-info-card card-email">
              <div className="card-top-icon-row">
                <div className="card-icon-badge mail-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="card-tag">OFFICIAL INBOX</span>
              </div>

              <h2 className="card-title">Email Us</h2>
              <p className="card-main-val email-val">sridevicollections1644@gmail.com</p>
              <p className="card-subtext">
                Send us inquiries for bulk festive orders, customized bridal embroidery motifs, and store queries.
              </p>

              <div className="card-actions-group">
                <a href="mailto:sridevicollections1644@gmail.com" className="cu-card-btn cu-btn-email">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Send An Email</span>
                  <span className="action-arrow">&rarr;</span>
                </a>
              </div>
            </article>

            {/* Card 3: Store Address & Location */}
            <article className="contact-info-card card-location">
              <div className="card-top-icon-row">
                <div className="card-icon-badge pin-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="card-tag">KANDUKUR SHOWROOM</span>
              </div>

              <h2 className="card-title">Store Location</h2>
              <p className="card-main-val address-val">
                Near Sai Baba Temple, Kovur Road, Kandukur - 523105, AP
              </p>
              <p className="card-subtext">
                Centrally located with convenient access from all parts of Kandukur and surrounding towns.
              </p>

              <div className="card-actions-group">
                <a
                  href="https://maps.app.goo.gl/61RjLJAiZmDNpHiY7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cu-card-btn cu-btn-maps"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Open in Google Maps</span>
                  <span className="action-arrow">&rarr;</span>
                </a>
              </div>
            </article>

            {/* Card 4: Timings & Assurance */}
            <article className="contact-info-card card-timings">
              <div className="card-top-icon-row">
                <div className="card-icon-badge clock-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="card-tag">WORKING HOURS</span>
              </div>

              <h2 className="card-title">Showroom Timings</h2>
              <p className="card-main-val timings-val">Mon – Sun: 9:30 AM – 9:30 PM</p>
              <p className="card-subtext">
                Open all 7 days of the week, including auspicious festival days and wedding seasons.
              </p>

              <div className="silk-mark-badge-strip">
                <span className="silk-sparkle">✦</span>
                <span>100% Silk Mark Certified Weaves</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Interactive Split Section: Inquiry Form & Live Google Map */}
      <section className="contact-interactive-section" aria-label="Send Inquiry and Map">
        <div className="contact-container">
          <div className="contact-split-box">
            {/* Left: Message Inquiry Form */}
            <div className="contact-form-column">
              <div className="form-header-box">
                <span className="form-eyebrow">MESSAGE OUR STORE</span>
                <h2 className="form-main-heading">Plan Your Visit or Inquiry</h2>
                <p className="form-subtitle">
                  Fill in your details below and our team will get in touch promptly with designs, colors, and availability.
                </p>
              </div>

              {/* Success Notification Alert (Form remains visible below) */}
              {isSubmitted && submittedInfo && (
                <div className="form-submit-alert-banner" role="status">
                  <div className="submit-alert-icon">✓</div>
                  <div className="submit-alert-text">
                    <h4>Inquiry Sent Successfully!</h4>
                    <p>
                      Thank you, <strong>{submittedInfo.name || 'Friend'}</strong>! Your inquiry details have been dispatched to our showroom email (<strong>{OWNER_EMAIL}</strong>) in table format. Our team will contact you on <strong>{submittedInfo.phone}</strong> shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* The Contact Form is ALWAYS Displayed on the Website */}
              <form className="contact-actual-form" onSubmit={handleFormSubmit}>
                  <div className="form-row-duo">
                    <div className="form-field-group">
                      <label htmlFor="contact-name" className="field-label">
                        Your Full Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Where elegance begins with your name..."
                        className="field-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="contact-phone" className="field-label">
                        Phone / WhatsApp Number <span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        required
                        value={formState.phone}
                        onChange={handleInputChange}
                        placeholder="Direct line for personalized saree styling &amp; quotes..."
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-service" className="field-label">
                      Interested Collection or Service
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formState.service}
                      onChange={handleInputChange}
                      className="field-select"
                    >
                      <option value="Pure Silk Sarees">Kanchipuram &amp; Pure Silk Sarees</option>
                      <option value="Royal Dola Silk">Royal Dola &amp; Designer Sarees</option>
                      <option value="Computer Work Blouses">Computer Embroidery Blouse Artistry</option>
                      <option value="Bridal Muhurtham Sarees">Bridal Muhurtham Trousseau</option>
                      <option value="Artisan Handlooms">Authentic Andhra Handlooms</option>
                      <option value="Custom Tailoring">Custom Tailoring &amp; Stitching</option>
                      <option value="General Store Visit">Planning a Showroom Visit</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="contact-message" className="field-label">
                      Message / Design Request (Optional)
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="3"
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Share your dream saree weave, occasion date, or bespoke blouse motifs..."
                      className="field-textarea"
                    />
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="form-submit-btn">
                      <span>Submit Inquiry</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="form-whatsapp-direct-btn"
                      onClick={handleWhatsAppInquiry}
                    >
                      <span>Send via WhatsApp</span>
                      <span className="wa-icon">&rarr;</span>
                    </button>
                  </div>
                </form>
            </div>

            {/* Right: Embedded Google Map & Showroom Information */}
            <div className="contact-map-column">
              <div className="map-frame-wrapper">
                <iframe
                  title="Sridevi Sarees Location Map"
                  src="https://maps.google.com/maps?q=Near+Sai+Baba+Temple,+Kovur+Road,+Kandukur,+Andhra+Pradesh+523105&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="contact-google-iframe"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="map-overlay-badge">
                  <span className="map-badge-pin">📍</span>
                  <div className="map-badge-text">
                    <strong>Sridevi Sarees Collections</strong>
                    <span>Near Sai Baba Temple, Kovur Road, Kandukur</span>
                  </div>
                </div>
              </div>

              {/* Showroom Directions Note */}
              <div className="map-guidance-card">
                <div className="guidance-icon-wrap" aria-hidden="true">⚜</div>
                <div className="guidance-details">
                  <h4>How To Reach Us</h4>
                  <p>
                    We are located right near the famous <strong>Sai Baba Temple on Kovur Road</strong> in Kandukur. Safe two-wheeler and four-wheeler parking is available in front of the store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Specialities Strip from Footer */}
      <section className="contact-specialities-strip" aria-label="Our Specialities">
        <div className="contact-container">
          <div className="specialities-inner-bar">
            <div className="specialities-header">
              <span className="spec-eyebrow">OUR SPECIALITIES</span>
              <h3 className="spec-heading">Crafted For Auspicious Beginnings</h3>
            </div>
            <div className="specialities-pills">
              <span className="spec-pill">✦ Kanchipuram Pattu</span>
              <span className="spec-pill">✦ Royal Dola Silk</span>
              <span className="spec-pill">✦ Artisan Handlooms</span>
              <span className="spec-pill">✦ Computer Work Blouses</span>
              <span className="spec-pill">✦ Custom Tailoring &amp; Stitching</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
