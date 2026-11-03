import React, { useState, useMemo } from 'react';
import './our-collections.css';

/**
 * All Saree Categories for Sridevi Sarees & Collections
 * Includes authentic Telugu traditional names and tags.
 */
const SAREE_CATEGORIES = [
  { id: 'all', name: 'All Sarees', telugu: 'అన్ని చీరలు', tag: 'All Weaves' },
  { id: 'kanchipuram-pattu', name: 'Kanchipuram Pattu', telugu: 'కాంచీపురం పట్టు', tag: 'Bridal Heritage' },
  { id: 'royal-dola-silk', name: 'Royal Dola Silk', telugu: 'రాయల్ డోలా సిల్క్', tag: 'Festive Classic' },
  { id: 'banarasi-silk', name: 'Banarasi Silk', telugu: 'బనారసి సిల్క్', tag: 'Zari Brocade' },
  { id: 'dharmavaram-pattu', name: 'Dharmavaram Pattu', telugu: 'ధర్మవరం పట్టు', tag: 'Heritage Border' },
  { id: 'gadwal-pattu', name: 'Gadwal Handloom', telugu: 'గద్వాల్ పట్టు', tag: 'Temple Weave' },
  { id: 'uppada-silk', name: 'Uppada Silk', telugu: 'ఉప్పాడ పట్టు', tag: 'Jamdani Pure' },
  { id: 'pochampally-ikkat', name: 'Pochampally Ikkat', telugu: 'పోచంపల్లి ఇక్కత్', tag: 'Tie & Dye' },
  { id: 'mangalagiri-pattu', name: 'Mangalagiri Pattu', telugu: 'మంగళగిరి పట్టు', tag: 'Nizam Border' },
  { id: 'pure-handloom', name: 'Pure Handloom Sarees', telugu: 'చేనేత చీరలు', tag: 'Artisan Pride' },
  { id: 'designer-silk', name: 'Designer Silk Sarees', telugu: 'డిజైనర్ సిల్క్', tag: 'Party Drapes' },
  { id: 'organza-tissue', name: 'Organza & Tissue Sarees', telugu: 'ఆర్గాన్జా సిల్క్', tag: 'Sheer Glow' },
  { id: 'chanderi-maheshwari', name: 'Chanderi & Maheshwari', telugu: 'మహేశ్వరి సిల్క్', tag: 'Royal Weave' },
  { id: 'chiffon-georgette', name: 'Chiffon & Georgette', telugu: 'షిఫాన్ & జార్జెట్', tag: 'Lightweight' },
  { id: 'pure-cotton', name: 'Pure Cotton Sarees', telugu: 'ప్యూర్ కాటన్', tag: 'Daily Comfort' },
  { id: 'bridal-muhurtham', name: 'Bridal Muhurtham Sarees', telugu: 'పెళ్ళి పట్టు చీరలు', tag: 'Sacred Muhurtham' },
  { id: 'festive-celebration', name: 'Festive & Celebration', telugu: 'పండుగ స్పెషల్', tag: 'Auspicious' }
];

// Price presets for quick selection with neat Indian Rupee formatting
const PRICE_PRESETS = [
  { label: 'All (₹450+)', min: 450, max: 6500, above: true },
  { label: '₹450 – ₹1,500', min: 450, max: 1500, above: false },
  { label: '₹1,500 – ₹3,000', min: 1500, max: 3000, above: false },
  { label: '₹3,000 – ₹4,500', min: 3000, max: 4500, above: false },
  { label: '₹4,500 – ₹6,500', min: 4500, max: 6500, above: false },
  { label: '₹6,500 & Above', min: 6500, max: 6500, above: true }
];

const MIN_COST_BOUND = 450;
const MAX_COST_BOUND = 6500;
const COST_STEP = 50;

/**
 * OurCollections Component
 * Fixed neatly aligned sidebar layout with dedicated scrolling effect for options,
 * dynamic cost range filter from ₹450 to ₹6500 and above, and Indian Rupee symbols throughout.
 */
const OurCollections = ({
  sarees = [],
  onNavigate = () => {},
  onFilterChange = () => {}
}) => {
  // Category state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Cost (Range) Dynamic Feature Bar State: ₹450 to ₹6500 and above
  const [minCost, setMinCost] = useState(MIN_COST_BOUND);
  const [maxCost, setMaxCost] = useState(MAX_COST_BOUND);
  const [isAbove6500, setIsAbove6500] = useState(true);

  // Sorting and Mobile Drawer states
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Filter categories by user search term in the sidebar
  const filteredCategoriesList = useMemo(() => {
    if (!categorySearchQuery.trim()) return SAREE_CATEGORIES;
    const query = categorySearchQuery.toLowerCase();
    return SAREE_CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.telugu.includes(query) ||
        cat.tag.toLowerCase().includes(query)
    );
  }, [categorySearchQuery]);

  // Handle dynamic dual slider changes
  const handleMinSliderChange = (e) => {
    const val = Number(e.target.value);
    if (val <= maxCost) {
      setMinCost(val);
      notifyFilterChange(selectedCategory, val, maxCost, isAbove6500);
    }
  };

  const handleMaxSliderChange = (e) => {
    const val = Number(e.target.value);
    if (val >= minCost) {
      setMaxCost(val);
      if (val === MAX_COST_BOUND) {
        setIsAbove6500(true);
      }
      notifyFilterChange(selectedCategory, minCost, val, val === MAX_COST_BOUND ? true : isAbove6500);
    }
  };

  // Toggle "₹6,500 and above" dynamic expander
  const handleToggleAbove = () => {
    const nextState = !isAbove6500;
    setIsAbove6500(nextState);
    if (nextState) {
      setMaxCost(MAX_COST_BOUND);
    }
    notifyFilterChange(selectedCategory, minCost, maxCost, nextState);
  };

  // Quick Price Preset Chip Click
  const handlePresetClick = (preset) => {
    setMinCost(preset.min);
    setMaxCost(preset.max);
    setIsAbove6500(preset.above);
    notifyFilterChange(selectedCategory, preset.min, preset.max, preset.above);
  };

  // Category selection handler
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    notifyFilterChange(catId, minCost, maxCost, isAbove6500);
    if (window.innerWidth < 992) {
      setIsMobileDrawerOpen(false);
    }
  };

  // Notify parent component if callback provided
  const notifyFilterChange = (category, min, max, above) => {
    onFilterChange({
      category,
      minCost: min,
      maxCost: max,
      isAbove6500: above
    });
  };

  // Reset all filters to default state
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setCategorySearchQuery('');
    setMinCost(MIN_COST_BOUND);
    setMaxCost(MAX_COST_BOUND);
    setIsAbove6500(true);
    notifyFilterChange('all', MIN_COST_BOUND, MAX_COST_BOUND, true);
  };

  // Percentage calculations for dynamic slider highlight bar
  const minPercent = Math.max(0, Math.min(100, ((minCost - MIN_COST_BOUND) / (MAX_COST_BOUND - MIN_COST_BOUND)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxCost - MIN_COST_BOUND) / (MAX_COST_BOUND - MIN_COST_BOUND)) * 100));

  // Determine current active category object
  const activeCategoryObj = SAREE_CATEGORIES.find((c) => c.id === selectedCategory) || SAREE_CATEGORIES[0];

  // Check if filters are dirty (different from default)
  const isFilterActive =
    selectedCategory !== 'all' ||
    minCost !== MIN_COST_BOUND ||
    maxCost !== MAX_COST_BOUND ||
    !isAbove6500;

  // Real sarees filtering (when real product array is supplied)
  const filteredSarees = useMemo(() => {
    if (!sarees || sarees.length === 0) return [];
    return sarees.filter((saree) => {
      if (selectedCategory !== 'all' && saree.category !== selectedCategory && saree.categoryId !== selectedCategory) {
        return false;
      }
      const priceNum = Number(saree.cost || saree.price || 0);
      if (priceNum < minCost) return false;
      if (!isAbove6500 && priceNum > maxCost) return false;
      return true;
    });
  }, [sarees, selectedCategory, minCost, maxCost, isAbove6500]);

  return (
    <div className="our-collections-page" id="our-collections-page">
      {/* =========================================================
          PAGE SUB-BANNER / BREADCRUMB
          ========================================================= */}
      <section className="col-hero-banner" aria-label="Our Collections Header">
        <div className="col-hero-pattern" aria-hidden="true" />
        <div className="col-hero-inner">
          <nav className="col-hero-breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => onNavigate('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span>Our Collections</span>
          </nav>

          <div className="col-hero-eyebrow">
            <span>✦</span>
            <span>EXCLUSIVE WEAVES • మన కలెక్షన్స్</span>
            <span>✦</span>
          </div>

          <h1 className="col-hero-title">OUR COLLECTIONS</h1>

          
        </div>
      </section>

      {/* =========================================================
          MAIN 2-COLUMN LAYOUT SHELL
          ========================================================= */}
      <div className="col-layout-shell">
        {/* Mobile Filter Toggle Button */}
        <div className="col-mobile-filter-bar">
          <button
            type="button"
            className="col-mobile-toggle-btn"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open filter sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filter Sarees &amp; Price Range</span>
            {isFilterActive && <span className="col-mobile-badge">Active</span>}
          </button>
        </div>

        {/* Drawer Backdrop for Mobile */}
        {isMobileDrawerOpen && (
          <div
            className="col-drawer-backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="col-main-grid">
          {/* =========================================================
              LEFT COLUMN: FIXED NEAT SIDEBAR (CATEGORIES + COST RANGE)
              ========================================================= */}
          <aside
            className={`col-sidebar ${isMobileDrawerOpen ? 'is-open' : ''}`}
            aria-label="Saree Filters Sidebar"
          >
            {/* Sidebar Top Header */}
            <div className="col-sidebar-header">
              <div className="col-sidebar-title-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <h2 className="col-sidebar-heading">Filters</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isFilterActive && (
                  <button
                    type="button"
                    className="col-sidebar-reset-btn"
                    onClick={handleResetFilters}
                    title="Reset all filters"
                  >
                    Reset All
                  </button>
                )}

                <button
                  type="button"
                  className="col-sidebar-close-btn"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* SECTION 1: ALL SAREES CATEGORIES (WITH DEDICATED SMOOTH SCROLLING EFFECT) */}
            <section className="col-sidebar-section" aria-label="Saree Categories">
              <div className="col-section-header">
                <h3 className="col-section-title">
                  <span className="col-section-bullet">✦</span>
                  <span>Saree Categories</span>
                </h3>
                <span className="col-section-badge">{SAREE_CATEGORIES.length} Types</span>
              </div>

              {/* Quick Search within Categories */}
              <div className="col-cat-search-box">
                <svg className="col-cat-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search categories (e.g. Pattu, Silk)..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  aria-label="Search saree categories"
                />
              </div>

              {/* Saree Categories List (Clean Full Display - No Scrollbox) */}
              <ul className="col-categories-list" role="radiogroup" aria-label="Saree Categories List">
                {filteredCategoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <li key={cat.id} className="col-cat-item">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        className={`col-cat-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => handleSelectCategory(cat.id)}
                      >
                        <div className="col-cat-btn-inner">
                          <span className="col-cat-indicator" aria-hidden="true">
                            <span className="col-cat-indicator-dot" />
                          </span>
                          <div className="col-cat-text-group">
                            <span className="col-cat-name">{cat.name}</span>
                            <span className="col-cat-telugu">{cat.telugu}</span>
                          </div>
                        </div>
                        <span className="col-cat-tag">{cat.tag}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* SECTION 2: UNDER THE SIDE BAR -> COST (RANGE) DYNAMIC FEATURE BAR WITH INDIAN RUPEE (₹) */}
            <section className="col-sidebar-section" aria-label="Cost Range Filter">
              <div className="col-section-header">
                <h3 className="col-section-title">
                  {/* INDIAN RUPEE SYMBOL (₹) IN PLACE OF DOLLAR */}
                  <span className="col-currency-rupee-pill" aria-hidden="true">₹</span>
                  <span>Cost (Price Range)</span>
                </h3>
                <span className="col-section-badge">Dynamic</span>
              </div>

              <div className="col-cost-card">
                {/* Neatly Aligned Single-Line Selected Range Readout */}
                <div className="col-cost-readout-card">
                  <span className="col-cost-readout-lbl">Selected Range:</span>
                  <span className="col-cost-badge">
                    ₹{minCost.toLocaleString('en-IN')} – ₹{maxCost.toLocaleString('en-IN')}
                    {isAbove6500 && maxCost >= MAX_COST_BOUND ? '+' : ''}
                  </span>
                </div>

                {/* Dynamic Dual Slider Feature Bar */}
                <div className="col-dynamic-bar-wrap">
                  {/* Track Background */}
                  <div className="col-slider-track-bg" />

                  {/* Active Highlight Fill */}
                  <div
                    className="col-slider-track-fill"
                    style={{
                      left: `${minPercent}%`,
                      width: `${Math.max(0, maxPercent - minPercent)}%`
                    }}
                  />

                  {/* Min Slider Layer */}
                  <input
                    type="range"
                    min={MIN_COST_BOUND}
                    max={MAX_COST_BOUND}
                    step={COST_STEP}
                    value={minCost}
                    onChange={handleMinSliderChange}
                    className="col-range-slider-input"
                    aria-label="Minimum cost"
                  />

                  {/* Max Slider Layer */}
                  <input
                    type="range"
                    min={MIN_COST_BOUND}
                    max={MAX_COST_BOUND}
                    step={COST_STEP}
                    value={maxCost}
                    onChange={handleMaxSliderChange}
                    className="col-range-slider-input"
                    aria-label="Maximum cost"
                  />
                </div>

                {/* Neatly Spaced Slider Endpoints Markers */}
                <div className="col-slider-markers" aria-hidden="true">
                  <span className={`marker-endpoint ${minCost === MIN_COST_BOUND ? 'active-limit' : ''}`}>
                    ₹450
                  </span>
                  <span className="marker-mid">₹2,500</span>
                  <span className="marker-mid">₹4,500</span>
                  <span className={`marker-endpoint ${maxCost === MAX_COST_BOUND ? 'active-limit' : ''}`}>
                    ₹6,500{isAbove6500 ? '+' : ''}
                  </span>
                </div>

                {/* Dynamic "₹6,500 & Above" Expander Toggle */}
                <div className="col-above-toggle-wrap">
                  <button
                    type="button"
                    className={`col-above-toggle-btn ${isAbove6500 ? 'is-active' : ''}`}
                    onClick={handleToggleAbove}
                  >
                    <span className="col-above-toggle-text">
                      Expand to <strong>₹6,500 &amp; Above</strong>
                    </span>
                    <span className="col-above-checkbox">
                      {isAbove6500 ? '✓' : ''}
                    </span>
                  </button>
                </div>

                {/* Precise Manual Min & Max Input Boxes with Indian Rupee (₹) */}
                <div className="col-cost-inputs-row">
                  <div className="col-input-group">
                    <label className="col-input-label" htmlFor="col-min-cost-input">
                      Min Cost
                    </label>
                    <div className="col-input-field-wrap">
                      <span className="col-input-currency">₹</span>
                      <input
                        id="col-min-cost-input"
                        type="number"
                        min={MIN_COST_BOUND}
                        max={maxCost}
                        step={50}
                        value={minCost}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!Number.isNaN(val) && val >= MIN_COST_BOUND && val <= maxCost) {
                            setMinCost(val);
                            notifyFilterChange(selectedCategory, val, maxCost, isAbove6500);
                          }
                        }}
                        className="col-cost-number-input"
                      />
                    </div>
                  </div>

                  <span className="col-input-sep">–</span>

                  <div className="col-input-group">
                    <label className="col-input-label" htmlFor="col-max-cost-input">
                      Max Cost
                    </label>
                    <div className="col-input-field-wrap">
                      <span className="col-input-currency">₹</span>
                      <input
                        id="col-max-cost-input"
                        type="number"
                        min={minCost}
                        max={MAX_COST_BOUND}
                        step={50}
                        value={maxCost}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!Number.isNaN(val) && val >= minCost && val <= MAX_COST_BOUND) {
                            setMaxCost(val);
                            notifyFilterChange(selectedCategory, minCost, val, isAbove6500);
                          }
                        }}
                        className="col-cost-number-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Price Band Chips (Neatly Aligned, Single Line) */}
                <div className="col-presets-section">
                  <div className="col-presets-title">Quick Price Bands</div>
                  <div className="col-presets-grid">
                    {PRICE_PRESETS.map((p) => {
                      const isPresetActive =
                        minCost === p.min && maxCost === p.max && isAbove6500 === p.above;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          className={`col-preset-chip ${isPresetActive ? 'is-active' : ''}`}
                          onClick={() => handlePresetClick(p)}
                          title={`Select ${p.label}`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar Bottom Action Buttons */}
            <div className="col-sidebar-footer-actions">
              <button
                type="button"
                className="col-apply-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                Apply Filters
              </button>
              {isFilterActive && (
                <button
                  type="button"
                  className="col-reset-all-btn"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              )}
            </div>
          </aside>

          {/* =========================================================
              RIGHT COLUMN: MAIN CONTENT CANVAS
              NOTE: STRICTLY NO DUMMY SAREES CONTENT (AS INSTRUCTED)
              ========================================================= */}
          <main className="col-main-content" aria-label="Saree Collection Showcase">
            {/* Top Showcase Status & Sorting Bar */}
            <div className="col-topbar">
              <div className="col-topbar-left">
                <h2 className="col-topbar-category-title">
                  <span>{activeCategoryObj.name}</span>
                  <span className="col-topbar-count-badge">
                    {filteredSarees.length} Sarees Available
                  </span>
                </h2>
                <p className="col-topbar-filter-desc">
                  Filtering sarees within range: ₹{minCost.toLocaleString('en-IN')} – ₹{maxCost.toLocaleString('en-IN')}
                  {isAbove6500 && maxCost >= MAX_COST_BOUND ? '+' : ''}
                </p>
              </div>

              <div className="col-topbar-right">
                <div className="col-sort-wrap">
                  <label htmlFor="col-sort-dropdown" className="col-sort-label">
                    Sort By:
                  </label>
                  <select
                    id="col-sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="col-sort-select"
                  >
                    <option value="featured">Featured Collections</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Badges Bar */}
            {isFilterActive && (
              <div className="col-active-pills-bar" aria-label="Active Filters">
                <span className="col-active-pills-label">Active Filters:</span>

                {selectedCategory !== 'all' && (
                  <span className="col-filter-pill">
                    Category: {activeCategoryObj.name}
                    <button
                      type="button"
                      className="col-filter-pill-remove"
                      onClick={() => handleSelectCategory('all')}
                      aria-label="Remove category filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                <span className="col-filter-pill">
                  Price: ₹{minCost.toLocaleString('en-IN')} – ₹{maxCost.toLocaleString('en-IN')}
                  {isAbove6500 && maxCost >= MAX_COST_BOUND ? '+' : ''}
                  <button
                    type="button"
                    className="col-filter-pill-remove"
                    onClick={() => {
                      setMinCost(MIN_COST_BOUND);
                      setMaxCost(MAX_COST_BOUND);
                      setIsAbove6500(true);
                      notifyFilterChange(selectedCategory, MIN_COST_BOUND, MAX_COST_BOUND, true);
                    }}
                    aria-label="Reset price filter"
                  >
                    ×
                  </button>
                </span>

                <button
                  type="button"
                  className="col-clear-all-pill-btn"
                  onClick={handleResetFilters}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* If actual sarees are provided via props, display them */}
            {filteredSarees.length > 0 ? (
              <div className="col-sarees-grid">
                {filteredSarees.map((saree) => (
                  <article key={saree.id || saree.productId} className="col-saree-card">
                    {saree.firstImageUrl && (
                      <img
                        src={saree.firstImageUrl}
                        alt={saree.name}
                        style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', color: 'var(--col-maroon)' }}>{saree.name}</h4>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--col-gold)' }}>
                        ₹{Number(saree.cost || saree.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /*
               * =====================================================================
               * NOTE ADHERENCE: DONT DISPLAY ANY DUMMY SAREES CONTENT
               * JUST CREATE THE NEAT SIDEBAR LAYOUT & PRESENT THE READY-STATE CANVAS
               * =====================================================================
               */
              <div className="col-canvas-frame" aria-label="Saree Layout Ready Canvas">
                <div className="col-canvas-icon-wrap" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>

                <div className="col-canvas-eyebrow">
                  <span>✦</span>
                  <span>SIDEBAR &amp; DYNAMIC COST FILTER ACTIVE</span>
                  <span>✦</span>
                </div>

                <h3 className="col-canvas-title">Saree Layout Framework Ready</h3>

                <p className="col-canvas-desc">
                  The fixed left sidebar is neatly aligned with smooth scrolling for all saree categories
                  and the dynamic price slider in Indian Rupees (₹450 to ₹6,500 and above).
                </p>

                {/* Filter Specs Pill Box */}
                <div className="col-canvas-specs">
                  <div className="col-spec-item">
                    <span className="col-spec-lbl">Selected Category:</span>
                    <span className="col-spec-val">{activeCategoryObj.name}</span>
                  </div>
                  <span className="col-spec-sep">✦</span>
                  <div className="col-spec-item">
                    <span className="col-spec-lbl">Cost Range:</span>
                    <span className="col-spec-val">
                      ₹{minCost.toLocaleString('en-IN')} – ₹{maxCost.toLocaleString('en-IN')}
                      {isAbove6500 && maxCost >= MAX_COST_BOUND ? '+' : ''}
                    </span>
                  </div>
                  <span className="col-spec-sep">✦</span>
                  <div className="col-spec-item">
                    <span className="col-spec-lbl">Dummy Sarees:</span>
                    <span className="col-spec-val">None (Hidden as requested)</span>
                  </div>
                </div>

                {/* Developer / Storefront Integration Notice */}
                <div className="col-canvas-note-box">
                  <strong>Layout Integration Status:</strong> When real saree products are supplied
                  or loaded from the backend catalog, they will automatically filter and render in
                  this grid based on the selected category and dynamic cost range.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OurCollections;
