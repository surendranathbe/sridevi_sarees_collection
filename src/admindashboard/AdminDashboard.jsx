import React, { useState, useEffect } from 'react';
import storeLogo from '../assets/logo_2.png';
import silkBanner from '../assets/silk-sarees-banner1.png';
import { useTypingAnimation } from '../data/typingAnimation';
import Products from './Products';
import EmbroideryServices from './EmbroideryServices';
import './admin.css';

// Sidebar navigation items matching Image 2
const SIDEBAR_NAV_ITEMS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )
  },
  {
    id: 'products',
    name: 'Products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: 'embroidery-designs',
    name: 'Embroidery Designs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
  },
  {
    id: 'delivery-status',
    name: 'Delivery Status',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    id: 'website-changes',
    name: 'Website Changes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  },
  {
    id: 'generate-bill',
    name: 'Generate Bill',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    )
  },
  {
    id: 'stock-status',
    name: 'Stock Status',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: 'revenue-status',
    name: 'Revenue Status',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
];

const AdminDashboard = () => {
  // Navigation & responsive drawer states
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Real-time live clock for top bar
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reusable typing animation hook for heading
  const { displayedText } = useTypingAnimation('Sridevi Sarees & Collections');

  // Products Management State (shared with Products.jsx)
  const [productsList, setProductsList] = useState([]);

  // Embroidery Services State (shared with EmbroideryServices.jsx)
  const [embroideryList, setEmbroideryList] = useState([]);

  // Real inventory list state: empty by default per "REAL DATA ONLY - NO DUMMY DATA" requirement
  const [inventoryList, setInventoryList] = useState([]);

  // Product creation form state with complete form labels
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Kanchi Silk Sarees',
    fabric: 'Pure Mulberry Silk',
    sku: '',
    price: '',
    mrp: '',
    stock: '',
    color: '',
    zariType: 'Pure Gold Zari',
    status: 'In Stock',
    imageUrl: '',
    description: '',
    isFeatured: true,
    isNewArrival: false
  });

  const [notification, setNotification] = useState(null);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Nav item switch handler
  const handleNavSelect = (itemName) => {
    setActiveNav(itemName);
    setIsSidebarOpen(false);
  };

  // Product submission handler (stores into real state & updates catalog)
  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!productForm.title || !productForm.price || !productForm.sku) {
      setNotification({
        type: 'error',
        text: 'Please complete all required fields marked with an asterisk (*).'
      });
      return;
    }

    const newItem = {
      id: Date.now(),
      name: productForm.title,
      category: productForm.category,
      sku: productForm.sku,
      price: Number(productForm.price),
      mrp: productForm.mrp ? Number(productForm.mrp) : null,
      stock: productForm.stock ? Number(productForm.stock) : 1,
      status: productForm.status
    };

    setInventoryList((prev) => [newItem, ...prev]);
    setNotification({
      type: 'success',
      text: `"${productForm.title}" added to catalog inventory successfully.`
    });
    setIsDrawerOpen(false);

    // Reset form
    setProductForm({
      title: '',
      category: 'Kanchi Silk Sarees',
      fabric: 'Pure Mulberry Silk',
      sku: '',
      price: '',
      mrp: '',
      stock: '',
      color: '',
      zariType: 'Pure Gold Zari',
      status: 'In Stock',
      imageUrl: '',
      description: '',
      isFeatured: false,
      isNewArrival: false
    });
  };

  const handleDeleteItem = (id, name) => {
    setInventoryList((prev) => prev.filter((item) => item.id !== id));
    setNotification({
      type: 'success',
      text: `Removed item "${name}" from inventory.`
    });
  };

  return (
    <div className="admin-layout">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          1) LEFT SIDEBAR (EXACT MATCH TO IMAGE 2)
          ========================================================= */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Top Logo & Brand Header - Logo in single line with text underneath */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand-stacked">
            <div className="admin-sidebar-logo-single-line">
              <img
                src={storeLogo}
                alt="Sridevi Collections"
                className="admin-sidebar-img-fluid"
              />
            </div>
            <div className="admin-sidebar-text-under">
              <span className="admin-mgmt-title">SRIDEVI COLLECTIONS</span>
              <span className="admin-mgmt-subtitle">ADMIN MANAGEMENT</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Static Middle Menu Container */}
        <div className="admin-sidebar-middle">
          {/* Group Heading */}
          <div className="admin-sidebar-group-label">Main Menu</div>

          {/* Navigation List */}
          <nav className="admin-sidebar-nav" aria-label="Admin Modules">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavSelect(item.name)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="admin-nav-left">
                    <span className="admin-nav-item-icon">{item.icon}</span>
                    <span className="admin-nav-item-text">{item.name}</span>
                  </div>
                  {item.name !== 'Dashboard' && (
                    <span className="admin-nav-chevron">›</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Location Box */}
        <div className="admin-sidebar-footer">
          <div className="admin-location-box">
            <div className="admin-location-row">
              <div className="admin-location-tag">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dfb76c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Kandukur AP Showroom</span>
              </div>
              <span className="admin-online-badge">
                <span className="admin-online-dot" /> Online
              </span>
            </div>
            <a href="#home" className="admin-sidebar-store-link">
              <span>View Customer Store</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </aside>

      {/* =========================================================
          2) MAIN RIGHT WORKSPACE & TOP BAR
          ========================================================= */}
      <div className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header className="admin-top-bar">
          <div className="admin-top-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <span className="admin-breadcrumb">
              ADMIN CONSOLE &nbsp;/&nbsp; KANDUKUR
            </span>
          </div>

          <div className="admin-top-right">
            {/* Real-Time Live Clock Widget */}
            <div className="admin-realtime-pill" title="Live System Clock (IST)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dfb76c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="admin-realtime-text">{currentTime}</span>
              <span className="admin-realtime-pulse-dot" />
            </div>

            {/* Notification Bell with Real-time Alert */}
            <button type="button" className="admin-bell-btn" title="Live Showroom Notifications" aria-label="Notifications">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="admin-bell-badge" />
            </button>

            <div className="admin-role-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              <span>Super Admin</span>
            </div>

            <div className="admin-user-info">
              <span className="admin-online-dot" />
              <span>admin@sridevisarees.com</span>
            </div>

            <div className="admin-avatar-circle" title="Administrator">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="admin-dash-container">
          {/* Page Title & Subtitle */}
          <div className="admin-page-header">
            <div className="admin-page-title-row">
              <h1
                className="admin-page-title-main"
                aria-label={activeNav === 'Dashboard' ? 'Sridevi Sarees & Collections' : activeNav}
              >
                {activeNav === 'Dashboard' ? (
                  <span className="admin-typing-text-wrap">
                    <span>{displayedText}</span>
                    <span className="admin-typing-cursor" aria-hidden="true">|</span>
                  </span>
                ) : (
                  activeNav
                )}
              </h1>
              <span className="admin-badge-gold-subtle">Showroom Control</span>
            </div>
            <p className="admin-page-subtitle-main">
              {activeNav === 'Dashboard'
                ? 'Manage your saree collections, orders, inventory and more from one place.'
                : `Manage and oversee ${activeNav.toLowerCase()} for Sridevi Sarees Kandukur.`}
            </p>
          </div>

          {/* Feedback Banner */}
          {notification && (
            <div className={`admin-alert-banner ${notification.type}`} role="alert">
              <span>{notification.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{notification.text}</span>
            </div>
          )}

          {/* =========================================================
              VIEW 1: PRIMARY DASHBOARD (MATCHING IMAGE 2 EXACTLY)
             ========================================================= */}
          {activeNav === 'Dashboard' ? (
            <>
              {/* Luxury Floral & Saree Heritage Banner with Real-time Imagery */}
              <section className="admin-luxury-banner" aria-label="Brand Heritage">
                <div className="admin-banner-deco-left" />
                <div className="admin-banner-content">
                  <div className="admin-banner-brand-title">
                    Sridevi Sarees & Collections
                  </div>
                  <div className="admin-banner-divider-text">
                    TRADITION &nbsp;•&nbsp; ELEGANCE &nbsp;•&nbsp; TIMELESS BEAUTY
                  </div>
                </div>
                <div className="admin-banner-img-wrap">
                  <img
                    src={silkBanner}
                    alt="Sridevi Pure Silk Saree"
                    className="admin-banner-saree-img"
                  />
                </div>
              </section>

              {/* 4 Summary Cards (Real Data Only - No Dummy Numbers) */}
              <section className="admin-summary-grid" aria-label="Dashboard Overview">
                {/* 1. Total Sarees in Stock */}
                <div className="admin-summary-card">
                  <div className="admin-summary-left">
                    <div className="admin-summary-icon admin-icon-amber">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <div className="admin-summary-details">
                      <span className="admin-summary-label">TOTAL SAREES IN STOCK</span>
                      <div className="admin-summary-value">
                        {productsList.length > 0 ? productsList.length : (inventoryList.length > 0 ? inventoryList.length : '—')}
                      </div>
                      <span className="admin-summary-subtext">
                        {productsList.length > 0
                          ? `${productsList.length} items recorded`
                          : inventoryList.length > 0
                          ? `${inventoryList.length} items recorded`
                          : 'No data available yet'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="admin-summary-arrow"
                    onClick={() => setActiveNav('Products')}
                    aria-label="View saree products"
                  >
                    ›
                  </button>
                </div>

                {/* 2. Active Categories */}
                <div className="admin-summary-card">
                  <div className="admin-summary-left">
                    <div className="admin-summary-icon admin-icon-rose">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                    </div>
                    <div className="admin-summary-details">
                      <span className="admin-summary-label">ACTIVE CATEGORIES</span>
                      <div className="admin-summary-value">—</div>
                      <span className="admin-summary-subtext">No data available yet</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="admin-summary-arrow"
                    onClick={() => setActiveNav('Products')}
                    aria-label="View categories"
                  >
                    ›
                  </button>
                </div>

                {/* 3. Customer Inquiries */}
                <div className="admin-summary-card">
                  <div className="admin-summary-left">
                    <div className="admin-summary-icon admin-icon-lavender">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="admin-summary-details">
                      <span className="admin-summary-label">CUSTOMER INQUIRIES</span>
                      <div className="admin-summary-value">—</div>
                      <span className="admin-summary-subtext">No data available yet</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="admin-summary-arrow"
                    onClick={() => setActiveNav('Orders')}
                    aria-label="View inquiries"
                  >
                    ›
                  </button>
                </div>

                {/* 4. Store Status */}
                <div className="admin-summary-card">
                  <div className="admin-summary-left">
                    <div className="admin-summary-icon admin-icon-mint">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="admin-summary-details">
                      <span className="admin-summary-label">STORE STATUS</span>
                      <div style={{ marginTop: '3px' }}>
                        <span className="admin-status-pill">OPEN (KANDUKUR)</span>
                      </div>
                      <span className="admin-summary-subtext" style={{ marginTop: '3px' }}>
                        Your store is currently open
                      </span>
                    </div>
                  </div>
                  <a
                    href="#home"
                    className="admin-summary-arrow"
                    style={{ textDecoration: 'none' }}
                    aria-label="Visit storefront"
                  >
                    ›
                  </a>
                </div>
              </section>

              {/* Middle Section: Quick Actions & Recent Activity */}
              <div className="admin-mid-grid">
                {/* Left Panel: Quick Actions */}
                <div className="admin-dash-panel">
                  <div className="admin-panel-header">
                    <div className="admin-panel-title-wrap">
                      <h3 className="admin-panel-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#c6923e">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>Quick Actions</span>
                      </h3>
                      <p className="admin-panel-subtext">Perform common tasks quickly and easily.</p>
                    </div>
                  </div>

                  <div className="admin-quick-actions-row">
                    {/* Action 1: Add New Product */}
                    <button
                      type="button"
                      className="admin-quick-action-card admin-qa-pink"
                      onClick={() => setActiveNav('Products')}
                    >
                      <div className="admin-qa-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <line x1="12" y1="12" x2="12" y2="22" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        </svg>
                      </div>
                      <span className="admin-qa-title">Add New Product</span>
                      <span className="admin-qa-circle-arrow">›</span>
                    </button>

                    {/* Action 2: Manage Categories */}
                    <button
                      type="button"
                      className="admin-quick-action-card admin-qa-gold"
                      onClick={() => setActiveNav('Products')}
                    >
                      <div className="admin-qa-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" rx="1.5" />
                          <rect x="14" y="3" width="7" height="7" rx="1.5" />
                          <rect x="14" y="14" width="7" height="7" rx="1.5" />
                          <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        </svg>
                      </div>
                      <span className="admin-qa-title">Manage Categories</span>
                      <span className="admin-qa-circle-arrow">›</span>
                    </button>

                    {/* Action 3: Manage Embroidery */}
                    <button
                      type="button"
                      className="admin-quick-action-card admin-qa-purple"
                      onClick={() => setActiveNav('Embroidery Designs')}
                    >
                      <div className="admin-qa-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="6" cy="6" r="3" />
                          <circle cx="6" cy="18" r="3" />
                          <line x1="20" y1="4" x2="8.12" y2="15.88" />
                          <line x1="14.47" y1="14.48" x2="20" y2="20" />
                        </svg>
                      </div>
                      <span className="admin-qa-title">Manage Embroidery</span>
                      <span className="admin-qa-circle-arrow">›</span>
                    </button>

                    {/* Action 4: Generate Bill */}
                    <button
                      type="button"
                      className="admin-quick-action-card admin-qa-green"
                      onClick={() => setActiveNav('Generate Bill')}
                    >
                      <div className="admin-qa-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="9" y1="13" x2="15" y2="13" />
                          <line x1="9" y1="17" x2="13" y2="17" />
                        </svg>
                      </div>
                      <span className="admin-qa-title">Generate Bill</span>
                      <span className="admin-qa-circle-arrow">›</span>
                    </button>
                  </div>
                </div>

                {/* Right Panel: Recent Activity (Real Empty State) */}
                <div className="admin-dash-panel">
                  <div className="admin-panel-header">
                    <div className="admin-panel-title-wrap">
                      <h3 className="admin-panel-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Recent Activity</span>
                      </h3>
                      <p className="admin-panel-subtext">Latest updates from your store.</p>
                    </div>
                    <span className="admin-panel-link">View All →</span>
                  </div>

                  <div className="admin-activity-empty">
                    <svg className="admin-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <h4 className="admin-empty-title">No recent Activity</h4>
                    <p className="admin-empty-text">
                      Updates like new orders, inquiries or stock changes will appear here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Current Store Catalog (Empty State Matching Image 2) */}
              <section className="admin-catalog-panel" aria-labelledby="catalog-heading">
                <div className="admin-catalog-header">
                  <div className="admin-catalog-header-left">
                    <div className="admin-catalog-icon-wrap">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <h3 id="catalog-heading" className="admin-panel-title">
                        Current Store Catalog
                      </h3>
                      <p className="admin-panel-subtext">View and manage your saree collection.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="admin-btn-wine"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <span>+</span> Add New Product
                  </button>
                </div>

                {/* Table or Empty State */}
                <div className="admin-catalog-table-wrap">
                  <table className="admin-catalog-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th>Price (₹)</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryList.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: 0 }}>
                            <div className="admin-catalog-empty">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9d9098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                              </svg>
                              <h4 className="admin-empty-title" style={{ marginTop: '0.25rem' }}>
                                No products in catalog
                              </h4>
                              <p className="admin-empty-text">Add your first saree to get started.</p>
                              <button
                                type="button"
                                className="admin-btn-wine"
                                style={{ marginTop: '0.5rem' }}
                                onClick={() => setIsDrawerOpen(true)}
                              >
                                <span>+</span> Add Product
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        inventoryList.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#786b73' }}>
                                {item.category}
                              </div>
                            </td>
                            <td>
                              <span style={{ fontFamily: 'monospace' }}>{item.sku}</span>
                            </td>
                            <td>
                              <strong>₹{item.price.toLocaleString('en-IN')}</strong>
                            </td>
                            <td>{item.stock} pcs</td>
                            <td>
                              <span className="admin-online-badge">
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #fecaca',
                                  color: '#c02626',
                                  borderRadius: '4px',
                                  padding: '0.25rem 0.55rem',
                                  fontSize: '0.74rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : activeNav === 'Products' || activeNav === 'Product Categories' ? (
            /* =========================================================
               VIEW 2: PRODUCTS MANAGEMENT MODULE (via Products.jsx)
               ========================================================= */
            <Products
              productsList={productsList}
              setProductsList={setProductsList}
              setNotification={setNotification}
            />
          ) : activeNav === 'Embroidery Designs' || activeNav === 'Embroidery Services' ? (
            /* =========================================================
               VIEW 3: EMBROIDERY DESIGNS MODULE (via EmbroideryServices.jsx)
               ========================================================= */
            <EmbroideryServices
              embroideryList={embroideryList}
              setEmbroideryList={setEmbroideryList}
              setNotification={setNotification}
            />
          ) : (
            /* =========================================================
               VIEW 4: OTHER MODULE PAGES (REAL EMPTY STATES)
               ========================================================= */
            <div className="admin-section-showcase">
              <div className="admin-showcase-header">
                <div className="admin-showcase-icon">
                  {SIDEBAR_NAV_ITEMS.find((item) => item.name === activeNav)?.icon}
                </div>
                <div>
                  <h2 className="admin-showcase-title">{activeNav}</h2>
                  <span className="admin-role-pill" style={{ marginTop: '0.3rem' }}>
                    Active Management View
                  </span>
                </div>
              </div>

              {activeNav === 'Product Categories' && (
                <div>
                  <p className="admin-showcase-desc">
                    Organize your pure silk, handloom, and designer saree collections into customer-facing departments.
                  </p>
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#faf7f3', borderRadius: '8px', border: '1px dashed #dcd0c5' }}>
                    <p style={{ color: '#786b73', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
                      No categories configured yet. Categories will populate as products are added.
                    </p>
                    <button
                      type="button"
                      className="admin-btn-wine"
                      onClick={() => setActiveNav('Products')}
                    >
                      <span>📦</span> Manage Products Catalog
                    </button>
                  </div>
                </div>
              )}

              {activeNav === 'Orders' && (
                <div>
                  <p className="admin-showcase-desc">
                    Track customer purchases, pending showroom pickups, and online inquiries.
                  </p>
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#faf7f3', borderRadius: '8px', border: '1px dashed #dcd0c5' }}>
                    <p style={{ color: '#786b73', fontSize: '0.88rem', margin: 0 }}>
                      No orders available yet. Incoming transactions will be listed here.
                    </p>
                  </div>
                </div>
              )}

              {activeNav === 'Delivery Status' && (
                <div>
                  <p className="admin-showcase-desc">
                    Courier consignments and dispatch tracking from Kandukur showroom.
                  </p>
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#faf7f3', borderRadius: '8px', border: '1px dashed #dcd0c5' }}>
                    <p style={{ color: '#786b73', fontSize: '0.88rem', margin: 0 }}>
                      No active dispatches in transit right now.
                    </p>
                  </div>
                </div>
              )}

              {activeNav === 'Website Changes' && (
                <div>
                  <p className="admin-showcase-desc">
                    Storefront promotional announcements, festive banner headlines, and contact info.
                  </p>
                  <div className="admin-form-group" style={{ maxWidth: '640px', marginTop: '1rem' }}>
                    <label htmlFor="promo-announcement" className="admin-form-label">
                      <span>Header Announcement Banner Text</span>
                    </label>
                    <input
                      id="promo-announcement"
                      type="text"
                      className="admin-form-input"
                      defaultValue="Special Festive Offer: Pure Kanchipuram Pattu Sarees & Computer Blouse Works at Kandukur Showroom!"
                    />
                    <div style={{ marginTop: '0.8rem' }}>
                      <button type="button" className="admin-btn-wine">
                        Save Banner Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeNav === 'Generate Bill' && (
                <div>
                  <p className="admin-showcase-desc">
                    Create clean retail invoices and tax receipts for walk-in showroom customers.
                  </p>
                  <div style={{ maxWidth: '640px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="admin-form-row-2">
                      <div className="admin-form-group">
                        <label htmlFor="bill-cust-name" className="admin-form-label">Customer Name</label>
                        <input id="bill-cust-name" type="text" className="admin-form-input" placeholder="e.g. Radhika Devi" />
                      </div>
                      <div className="admin-form-group">
                        <label htmlFor="bill-cust-phone" className="admin-form-label">Mobile Number</label>
                        <input id="bill-cust-phone" type="tel" className="admin-form-input" placeholder="+91 98498 37338" />
                      </div>
                    </div>
                    <button type="button" className="admin-btn-wine" style={{ width: 'fit-content' }}>
                      🧾 Generate Showroom Bill
                    </button>
                  </div>
                </div>
              )}

              {activeNav === 'Stock Status' && (
                <div>
                  <p className="admin-showcase-desc">
                    Inventory threshold alerts, low-stock warnings, and reorder levels.
                  </p>
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#faf7f3', borderRadius: '8px', border: '1px dashed #dcd0c5' }}>
                    <p style={{ color: '#786b73', fontSize: '0.88rem', margin: 0 }}>
                      Inventory count: {inventoryList.length} items recorded. No low stock alerts.
                    </p>
                  </div>
                </div>
              )}

              {activeNav === 'Revenue Status' && (
                <div>
                  <p className="admin-showcase-desc">
                    Sales receipts, monthly revenue growth, and payment reconciliations.
                  </p>
                  <div style={{ padding: '2.5rem', textAlign: 'center', background: '#faf7f3', borderRadius: '8px', border: '1px dashed #dcd0c5' }}>
                    <p style={{ color: '#786b73', fontSize: '0.88rem', margin: 0 }}>
                      Revenue information will appear once showroom or online transactions are recorded.
                    </p>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '2rem' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setActiveNav('Dashboard')}
                >
                  ← Return to Main Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          3) DEDICATED SLIDE-OVER DRAWER FOR "ADD PRODUCT"
             (Preserves 100% of required form fields & labels without crowding dashboard)
          ========================================================= */}
      {isDrawerOpen && (
        <>
          <div
            className="admin-drawer-backdrop"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          <aside className="admin-drawer" aria-labelledby="drawer-heading">
            <div className="admin-drawer-header">
              <div className="admin-drawer-title-wrap">
                <h3 id="drawer-heading" className="admin-drawer-title">
                  Add New Saree or Collection Item
                </h3>
                <p className="admin-drawer-desc">
                  Input specifications, pricing, and stock details for new bridal and festive sarees.
                </p>
              </div>
              <button
                type="button"
                className="admin-drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close product drawer"
              >
                ✕
              </button>
            </div>

            <div className="admin-drawer-body">
              <form className="admin-drawer-form" onSubmit={handleAddProduct} noValidate>
                {/* Product Title Label & Input */}
                <div className="admin-form-group">
                  <label htmlFor="drawer-product-title" className="admin-form-label">
                    <span>
                      Saree Title / Design Name
                      <span className="admin-form-label-required">*</span>
                    </span>
                    <span className="admin-form-label-hint">Full descriptive title</span>
                  </label>
                  <input
                    id="drawer-product-title"
                    name="title"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Pure Kanchipuram Pattu Saree with Grand Zari Pallu"
                    value={productForm.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category & Fabric Row */}
                <div className="admin-form-row-2">
                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-category" className="admin-form-label">
                      <span>
                        Saree Category
                        <span className="admin-form-label-required">*</span>
                      </span>
                    </label>
                    <select
                      id="drawer-product-category"
                      name="category"
                      className="admin-form-select"
                      value={productForm.category}
                      onChange={handleInputChange}
                    >
                      <option value="Kanchi Silk Sarees">Kanchi Silk Sarees</option>
                      <option value="Banarasi Sarees">Banarasi Sarees</option>
                      <option value="Handloom Silks">Handloom Silks</option>
                      <option value="Computer Embroidery Blouses">Computer Embroidery Blouses</option>
                      <option value="Tussar & Organza">Tussar & Organza</option>
                      <option value="Daily & Festive Cottons">Daily & Festive Cottons</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-fabric" className="admin-form-label">
                      <span>Fabric Type</span>
                    </label>
                    <select
                      id="drawer-product-fabric"
                      name="fabric"
                      className="admin-form-select"
                      value={productForm.fabric}
                      onChange={handleInputChange}
                    >
                      <option value="Pure Mulberry Silk">Pure Mulberry Silk</option>
                      <option value="Pure Katan Silk">Pure Katan Silk</option>
                      <option value="Gadwal Handloom Cotton-Silk">Gadwal Handloom Cotton-Silk</option>
                      <option value="Organza Sheer">Organza Sheer</option>
                      <option value="Velvet & Raw Silk">Velvet & Raw Silk</option>
                    </select>
                  </div>
                </div>

                {/* SKU Code, Stock & Color */}
                <div className="admin-form-row-3">
                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-sku" className="admin-form-label">
                      <span>
                        SKU Identifier
                        <span className="admin-form-label-required">*</span>
                      </span>
                    </label>
                    <input
                      id="drawer-product-sku"
                      name="sku"
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. SDS-KNC-0105"
                      value={productForm.sku}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-stock" className="admin-form-label">
                      <span>Stock Units</span>
                    </label>
                    <input
                      id="drawer-product-stock"
                      name="stock"
                      type="number"
                      min="0"
                      className="admin-form-input"
                      placeholder="e.g. 5"
                      value={productForm.stock}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-color" className="admin-form-label">
                      <span>Primary Shade</span>
                    </label>
                    <input
                      id="drawer-product-color"
                      name="color"
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Crimson Red / Gold"
                      value={productForm.color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Pricing Row */}
                <div className="admin-form-row-2">
                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-price" className="admin-form-label">
                      <span>
                        Selling Price (₹ INR)
                        <span className="admin-form-label-required">*</span>
                      </span>
                      <span className="admin-form-label-hint">Final customer rate</span>
                    </label>
                    <input
                      id="drawer-product-price"
                      name="price"
                      type="number"
                      min="0"
                      className="admin-form-input"
                      placeholder="e.g. 16500"
                      value={productForm.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-mrp" className="admin-form-label">
                      <span>Original MRP (₹ INR)</span>
                      <span className="admin-form-label-hint">Showroom sticker</span>
                    </label>
                    <input
                      id="drawer-product-mrp"
                      name="mrp"
                      type="number"
                      min="0"
                      className="admin-form-input"
                      placeholder="e.g. 21000"
                      value={productForm.mrp}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Zari & Availability Status */}
                <div className="admin-form-row-2">
                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-zari-type" className="admin-form-label">
                      <span>Zari / Border Work</span>
                    </label>
                    <select
                      id="drawer-product-zari-type"
                      name="zariType"
                      className="admin-form-select"
                      value={productForm.zariType}
                      onChange={handleInputChange}
                    >
                      <option value="Pure Gold Zari">Pure Gold Zari</option>
                      <option value="Tested Fine Zari">Tested Fine Zari</option>
                      <option value="Silver Antique Zari">Silver Antique Zari</option>
                      <option value="Copper Antique Zari">Copper Antique Zari</option>
                      <option value="Resham Thread Weave">Resham Thread Weave</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="drawer-product-status" className="admin-form-label">
                      <span>Availability Status</span>
                    </label>
                    <select
                      id="drawer-product-status"
                      name="status"
                      className="admin-form-select"
                      value={productForm.status}
                      onChange={handleInputChange}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Image URL / Asset Path Label & Input */}
                <div className="admin-form-group">
                  <label htmlFor="drawer-product-image-url" className="admin-form-label">
                    <span>Product Image Source / Path</span>
                    <span className="admin-form-label-hint">Local asset or hosted URL</span>
                  </label>
                  <input
                    id="drawer-product-image-url"
                    name="imageUrl"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. /assets/silk-sarees-banner1.png"
                    value={productForm.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Description Label & Textarea */}
                <div className="admin-form-group">
                  <label htmlFor="drawer-product-description" className="admin-form-label">
                    <span>Saree Description & Weaving Details</span>
                    <span className="admin-form-label-hint">Occasions, blouse piece, care notes</span>
                  </label>
                  <textarea
                    id="drawer-product-description"
                    name="description"
                    rows="3"
                    className="admin-form-textarea"
                    placeholder="Enter weave technique, pallu pattern, included unstitched blouse details, etc."
                    value={productForm.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Feature Badges Checkboxes */}
                <div className="admin-checkbox-group" style={{ padding: '0.4rem 0' }}>
                  <label htmlFor="drawer-product-is-featured" className="admin-checkbox-label">
                    <input
                      id="drawer-product-is-featured"
                      name="isFeatured"
                      type="checkbox"
                      className="admin-checkbox-input"
                      checked={productForm.isFeatured}
                      onChange={handleInputChange}
                    />
                    <span>Highlight as Featured Showcase</span>
                  </label>

                  <label htmlFor="drawer-product-is-new-arrival" className="admin-checkbox-label">
                    <input
                      id="drawer-product-is-new-arrival"
                      name="isNewArrival"
                      type="checkbox"
                      className="admin-checkbox-input"
                      checked={productForm.isNewArrival}
                      onChange={handleInputChange}
                    />
                    <span>Mark as New Festive Arrival</span>
                  </label>
                </div>

                {/* Drawer Footer Actions */}
                <div className="admin-drawer-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-wine">
                    <span>💾</span> Save Saree to Catalog
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
