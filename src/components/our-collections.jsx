import React, { useState, useMemo } from 'react';
import { SAREE_CATEGORIES } from '../data/products';
import './our-collections.css';

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
  // Applied filters state (Drives the active showcase, count badge, and main content)
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    minCost: MIN_COST_BOUND,
    maxCost: MAX_COST_BOUND,
    isAbove6500: true
  });

  // Draft filter states (Controlled inside sidebar / mobile drawer until user clicks "Apply Filters")
  const [draftCategory, setDraftCategory] = useState('all');
  const [draftMinCost, setDraftMinCost] = useState(MIN_COST_BOUND);
  const [draftMaxCost, setDraftMaxCost] = useState(MAX_COST_BOUND);
  const [draftIsAbove6500, setDraftIsAbove6500] = useState(true);

  // Manual cost input string states for fluid manual typing on mobile and desktop
  const [minCostInput, setMinCostInput] = useState(String(MIN_COST_BOUND));
  const [maxCostInput, setMaxCostInput] = useState(String(MAX_COST_BOUND));

  // Category quick search, sorting and mobile drawer states
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Open mobile drawer and sync draft with currently applied filters
  const handleOpenMobileDrawer = () => {
    setDraftCategory(appliedFilters.category);
    setDraftMinCost(appliedFilters.minCost);
    setDraftMaxCost(appliedFilters.maxCost);
    setDraftIsAbove6500(appliedFilters.isAbove6500);
    setMinCostInput(String(appliedFilters.minCost));
    setMaxCostInput(String(appliedFilters.maxCost));
    setIsMobileDrawerOpen(true);
  };

  // Close mobile drawer and revert unapplied draft changes
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
    setDraftCategory(appliedFilters.category);
    setDraftMinCost(appliedFilters.minCost);
    setDraftMaxCost(appliedFilters.maxCost);
    setDraftIsAbove6500(appliedFilters.isAbove6500);
    setMinCostInput(String(appliedFilters.minCost));
    setMaxCostInput(String(appliedFilters.maxCost));
  };

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

  // Handle dynamic dual slider changes (Updates draft state smoothly)
  const handleMinSliderChange = (e) => {
    const val = Number(e.target.value);
    if (val <= draftMaxCost) {
      setDraftMinCost(val);
      setMinCostInput(String(val));
      if (typeof window !== 'undefined' && window.innerWidth >= 992) {
        setAppliedFilters((prev) => ({ ...prev, minCost: val }));
        notifyFilterChange(appliedFilters.category, val, draftMaxCost, draftIsAbove6500);
      }
    }
  };

  const handleMaxSliderChange = (e) => {
    const val = Number(e.target.value);
    if (val >= draftMinCost) {
      setDraftMaxCost(val);
      setMaxCostInput(String(val));
      const nextAbove = val === MAX_COST_BOUND ? true : draftIsAbove6500;
      if (val === MAX_COST_BOUND) {
        setDraftIsAbove6500(true);
      }
      if (typeof window !== 'undefined' && window.innerWidth >= 992) {
        setAppliedFilters((prev) => ({ ...prev, maxCost: val, isAbove6500: nextAbove }));
        notifyFilterChange(appliedFilters.category, draftMinCost, val, nextAbove);
      }
    }
  };

  // Toggle "₹6,500 and above" dynamic expander
  const handleToggleAbove = () => {
    const nextState = !draftIsAbove6500;
    setDraftIsAbove6500(nextState);
    if (nextState) {
      setDraftMaxCost(MAX_COST_BOUND);
      setMaxCostInput(String(MAX_COST_BOUND));
    }
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setAppliedFilters((prev) => ({
        ...prev,
        maxCost: nextState ? MAX_COST_BOUND : draftMaxCost,
        isAbove6500: nextState
      }));
      notifyFilterChange(
        appliedFilters.category,
        draftMinCost,
        nextState ? MAX_COST_BOUND : draftMaxCost,
        nextState
      );
    }
  };

  // Quick Price Preset Chip Click
  const handlePresetClick = (preset) => {
    setDraftMinCost(preset.min);
    setDraftMaxCost(preset.max);
    setMinCostInput(String(preset.min));
    setMaxCostInput(String(preset.max));
    setDraftIsAbove6500(preset.above);

    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setAppliedFilters((prev) => ({
        ...prev,
        minCost: preset.min,
        maxCost: preset.max,
        isAbove6500: preset.above
      }));
      notifyFilterChange(appliedFilters.category, preset.min, preset.max, preset.above);
    }
  };

  // Category selection handler
  // CRITICAL REQUIREMENT: On mobile screen, NEVER close the drawer when clicking a category!
  // The drawer stays open so user can adjust price and click "Apply Filters".
  const handleSelectCategory = (catId) => {
    setDraftCategory(catId);
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setAppliedFilters((prev) => ({ ...prev, category: catId }));
      notifyFilterChange(catId, draftMinCost, draftMaxCost, draftIsAbove6500);
    }
  };

  // Manual Min Cost Input Handlers (Allows typing freely on mobile and desktop)
  const handleMinCostInputChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '');
    setMinCostInput(clean);
    if (clean !== '') {
      const num = parseInt(clean, 10);
      if (num >= MIN_COST_BOUND && num <= draftMaxCost) {
        setDraftMinCost(num);
      }
    }
  };

  const handleMinCostInputBlur = () => {
    let num = parseInt(minCostInput.replace(/\D/g, ''), 10);
    if (isNaN(num) || num < MIN_COST_BOUND) {
      num = MIN_COST_BOUND;
    } else if (num > draftMaxCost) {
      num = draftMaxCost;
    }
    setDraftMinCost(num);
    setMinCostInput(String(num));

    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setAppliedFilters((prev) => ({ ...prev, minCost: num }));
      notifyFilterChange(appliedFilters.category, num, draftMaxCost, draftIsAbove6500);
    }
  };

  const handleMinCostKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Manual Max Cost Input Handlers
  const handleMaxCostInputChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '');
    setMaxCostInput(clean);
    if (clean !== '') {
      const num = parseInt(clean, 10);
      if (num >= draftMinCost && num <= MAX_COST_BOUND) {
        setDraftMaxCost(num);
        if (num === MAX_COST_BOUND) {
          setDraftIsAbove6500(true);
        }
      }
    }
  };

  const handleMaxCostInputBlur = () => {
    let num = parseInt(maxCostInput.replace(/\D/g, ''), 10);
    if (isNaN(num)) {
      num = MAX_COST_BOUND;
    } else if (num < draftMinCost) {
      num = draftMinCost;
    } else if (num > MAX_COST_BOUND) {
      num = MAX_COST_BOUND;
    }
    setDraftMaxCost(num);
    setMaxCostInput(String(num));
    const nextAbove = num === MAX_COST_BOUND ? true : draftIsAbove6500;
    if (num === MAX_COST_BOUND) {
      setDraftIsAbove6500(true);
    }

    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      setAppliedFilters((prev) => ({ ...prev, maxCost: num, isAbove6500: nextAbove }));
      notifyFilterChange(appliedFilters.category, draftMinCost, num, nextAbove);
    }
  };

  const handleMaxCostKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  // Apply Filters Action
  // On mobile screen: Commits draft filters, closes the drawer, and reveals the filtered results
  const handleApplyFilters = () => {
    let finalMin = parseInt(minCostInput.replace(/\D/g, ''), 10);
    if (isNaN(finalMin) || finalMin < MIN_COST_BOUND) {
      finalMin = MIN_COST_BOUND;
    }
    let finalMax = parseInt(maxCostInput.replace(/\D/g, ''), 10);
    if (isNaN(finalMax) || finalMax > MAX_COST_BOUND) {
      finalMax = MAX_COST_BOUND;
    }
    if (finalMin > finalMax) {
      finalMin = finalMax;
    }

    setDraftMinCost(finalMin);
    setDraftMaxCost(finalMax);
    setMinCostInput(String(finalMin));
    setMaxCostInput(String(finalMax));

    const nextApplied = {
      category: draftCategory,
      minCost: finalMin,
      maxCost: finalMax,
      isAbove6500: draftIsAbove6500
    };
    setAppliedFilters(nextApplied);
    notifyFilterChange(draftCategory, finalMin, finalMax, draftIsAbove6500);

    // Close the filter drawer on mobile
    setIsMobileDrawerOpen(false);

    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      const topbarEl = document.querySelector('.col-topbar');
      if (topbarEl) {
        topbarEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
    setDraftCategory('all');
    setCategorySearchQuery('');
    setDraftMinCost(MIN_COST_BOUND);
    setDraftMaxCost(MAX_COST_BOUND);
    setDraftIsAbove6500(true);
    setMinCostInput(String(MIN_COST_BOUND));
    setMaxCostInput(String(MAX_COST_BOUND));

    const resetApplied = {
      category: 'all',
      minCost: MIN_COST_BOUND,
      maxCost: MAX_COST_BOUND,
      isAbove6500: true
    };
    setAppliedFilters(resetApplied);
    notifyFilterChange('all', MIN_COST_BOUND, MAX_COST_BOUND, true);

    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      setIsMobileDrawerOpen(false);
    }
  };

  // Remove individual filter badge pills
  const handleRemoveCategoryPill = () => {
    setDraftCategory('all');
    setAppliedFilters((prev) => ({ ...prev, category: 'all' }));
    notifyFilterChange('all', appliedFilters.minCost, appliedFilters.maxCost, appliedFilters.isAbove6500);
  };

  const handleRemovePricePill = () => {
    setDraftMinCost(MIN_COST_BOUND);
    setDraftMaxCost(MAX_COST_BOUND);
    setDraftIsAbove6500(true);
    setMinCostInput(String(MIN_COST_BOUND));
    setMaxCostInput(String(MAX_COST_BOUND));

    setAppliedFilters((prev) => ({
      ...prev,
      minCost: MIN_COST_BOUND,
      maxCost: MAX_COST_BOUND,
      isAbove6500: true
    }));
    notifyFilterChange(appliedFilters.category, MIN_COST_BOUND, MAX_COST_BOUND, true);
  };

  // Percentage calculations for dynamic slider highlight bar
  const minPercent = Math.max(0, Math.min(100, ((draftMinCost - MIN_COST_BOUND) / (MAX_COST_BOUND - MIN_COST_BOUND)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((draftMaxCost - MIN_COST_BOUND) / (MAX_COST_BOUND - MIN_COST_BOUND)) * 100));

  // Determine current active category object
  const activeCategoryObj =
    SAREE_CATEGORIES.find((c) => c.id === appliedFilters.category) || SAREE_CATEGORIES[0];

  // Check if filters are dirty (different from default)
  const isFilterActive =
    appliedFilters.category !== 'all' ||
    appliedFilters.minCost !== MIN_COST_BOUND ||
    appliedFilters.maxCost !== MAX_COST_BOUND ||
    !appliedFilters.isAbove6500;

  // Real sarees filtering (when real product array is supplied)
  const filteredSarees = useMemo(() => {
    if (!sarees || sarees.length === 0) return [];
    return sarees.filter((saree) => {
      if (
        appliedFilters.category !== 'all' &&
        saree.category !== appliedFilters.category &&
        saree.categoryId !== appliedFilters.category
      ) {
        return false;
      }
      const priceNum = Number(saree.cost || saree.price || 0);
      if (priceNum < appliedFilters.minCost) return false;
      if (!appliedFilters.isAbove6500 && priceNum > appliedFilters.maxCost) return false;
      return true;
    });
  }, [sarees, appliedFilters]);

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
            onClick={handleOpenMobileDrawer}
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
            onClick={handleCloseMobileDrawer}
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
                  onClick={handleCloseMobileDrawer}
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
                  const isActive = draftCategory === cat.id;
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
                    ₹{draftMinCost.toLocaleString('en-IN')} – ₹{draftMaxCost.toLocaleString('en-IN')}
                    {draftIsAbove6500 && draftMaxCost >= MAX_COST_BOUND ? '+' : ''}
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
                    value={draftMinCost}
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
                    value={draftMaxCost}
                    onChange={handleMaxSliderChange}
                    className="col-range-slider-input"
                    aria-label="Maximum cost"
                  />
                </div>

                {/* Neatly Spaced Slider Endpoints Markers */}
                <div className="col-slider-markers" aria-hidden="true">
                  <span className={`marker-endpoint ${draftMinCost === MIN_COST_BOUND ? 'active-limit' : ''}`}>
                    ₹450
                  </span>
                  <span className="marker-mid">₹2,500</span>
                  <span className="marker-mid">₹4,500</span>
                  <span className={`marker-endpoint ${draftMaxCost === MAX_COST_BOUND ? 'active-limit' : ''}`}>
                    ₹6,500{draftIsAbove6500 ? '+' : ''}
                  </span>
                </div>

                {/* Dynamic "₹6,500 & Above" Expander Toggle */}
                <div className="col-above-toggle-wrap">
                  <button
                    type="button"
                    className={`col-above-toggle-btn ${draftIsAbove6500 ? 'is-active' : ''}`}
                    onClick={handleToggleAbove}
                  >
                    <span className="col-above-toggle-text">
                      Expand to <strong>₹6,500 &amp; Above</strong>
                    </span>
                    <span className="col-above-checkbox">
                      {draftIsAbove6500 ? '✓' : ''}
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={minCostInput}
                        onChange={handleMinCostInputChange}
                        onBlur={handleMinCostInputBlur}
                        onKeyDown={handleMinCostKeyDown}
                        placeholder={String(MIN_COST_BOUND)}
                        className="col-cost-number-input"
                        aria-label="Minimum cost in rupees"
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={maxCostInput}
                        onChange={handleMaxCostInputChange}
                        onBlur={handleMaxCostInputBlur}
                        onKeyDown={handleMaxCostKeyDown}
                        placeholder={String(MAX_COST_BOUND)}
                        className="col-cost-number-input"
                        aria-label="Maximum cost in rupees"
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
                        draftMinCost === p.min && draftMaxCost === p.max && draftIsAbove6500 === p.above;
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
                onClick={handleApplyFilters}
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
                  Filtering sarees within range: ₹{appliedFilters.minCost.toLocaleString('en-IN')} – ₹{appliedFilters.maxCost.toLocaleString('en-IN')}
                  {appliedFilters.isAbove6500 && appliedFilters.maxCost >= MAX_COST_BOUND ? '+' : ''}
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

                {appliedFilters.category !== 'all' && (
                  <span className="col-filter-pill">
                    Category: {activeCategoryObj.name}
                    <button
                      type="button"
                      className="col-filter-pill-remove"
                      onClick={handleRemoveCategoryPill}
                      aria-label="Remove category filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                <span className="col-filter-pill">
                  Price: ₹{appliedFilters.minCost.toLocaleString('en-IN')} – ₹{appliedFilters.maxCost.toLocaleString('en-IN')}
                  {appliedFilters.isAbove6500 && appliedFilters.maxCost >= MAX_COST_BOUND ? '+' : ''}
                  <button
                    type="button"
                    className="col-filter-pill-remove"
                    onClick={handleRemovePricePill}
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
                        loading="lazy"
                        decoding="async"
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
                      ₹{appliedFilters.minCost.toLocaleString('en-IN')} – ₹{appliedFilters.maxCost.toLocaleString('en-IN')}
                      {appliedFilters.isAbove6500 && appliedFilters.maxCost >= MAX_COST_BOUND ? '+' : ''}
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
