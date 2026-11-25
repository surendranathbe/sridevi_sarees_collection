import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SAREE_CATEGORIES } from '../data/products';
import { apiFetch, getApiBaseUrl } from '../utils/api';
import { addToCart, getCartItems, CART_UPDATE_EVENT } from '../utils/cart';
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
const STORE_WHATSAPP_NUMBER = '919849837338';

const buildWhatsAppProductUrl = (saree, categoryName, intent = 'enquiry') => {
  const productId = (saree?.productId || 'N/A').trim();
  const productName = (saree?.name || 'Saree').trim();
  const priceText = `₹${Number(saree?.cost ?? saree?.price ?? 0).toLocaleString('en-IN')}`;
  const detailsText = (saree?.description || 'Interested in knowing fabric weave, color availability, and delivery details.').trim();
  const catLabel = categoryName || saree?.category || 'Saree Collection';

  const header =
    intent === 'buy'
      ? '*Order Request — Sridevi Sarees & Collections*'
      : '*Product Enquiry — Sridevi Sarees & Collections*';

  const closing =
    intent === 'buy'
      ? 'I would like to purchase this saree. Please share payment & delivery details.'
      : 'Could you please confirm availability and share more details about this saree?';

  const message = [
    'Namaskaram Sridevi Sarees & Collections! 🙏',
    '',
    header,
    `• *Product ID:* ${productId}`,
    `• *Product Name:* ${productName}`,
    `• *Category:* ${catLabel}`,
    `• *Price:* ${priceText}`,
    `• *Product Details:* ${detailsText}`,
    '',
    closing
  ].join('\n');

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

const resolveProductImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

/**
 * OurCollections Component
 * Fixed neatly aligned sidebar layout with dedicated scrolling effect for options,
 * dynamic cost range filter from ₹450 to ₹6500 and above, Indian Rupee symbols,
 * and dedicated category pages backed by MongoDB products.
 */
const OurCollections = ({
  sarees = null,
  initialCategory = 'all',
  onCategoryRouteChange = () => {},
  onNavigate = () => {},
  onFilterChange = () => {}
}) => {
  const validInitialCategory = SAREE_CATEGORIES.some((c) => c.id === initialCategory)
    ? initialCategory
    : 'all';

  // Fetched products from backend database
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(sarees === null);
  const [productsError, setProductsError] = useState('');

  // Applied filters state (Drives the active showcase, count badge, and main content)
  const [appliedFilters, setAppliedFilters] = useState({
    category: validInitialCategory,
    minCost: MIN_COST_BOUND,
    maxCost: MAX_COST_BOUND,
    isAbove6500: true
  });

  // Draft filter states (Controlled inside sidebar / mobile drawer until user clicks "Apply Filters")
  const [draftCategory, setDraftCategory] = useState(validInitialCategory);
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
  const [cartProductIds, setCartProductIds] = useState(() => new Set(getCartItems().map((i) => i.productId)));
  const [justAddedId, setJustAddedId] = useState('');

  useEffect(() => {
    const syncCartIds = () => {
      setCartProductIds(new Set(getCartItems().map((i) => i.productId)));
    };
    window.addEventListener(CART_UPDATE_EVENT, syncCartIds);
    window.addEventListener('storage', syncCartIds);
    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, syncCartIds);
      window.removeEventListener('storage', syncCartIds);
    };
  }, []);

  const handleAddToCart = (saree, categoryName, resolvedPrimaryImg, resolvedHoverImg) => {
    const pid = (saree.productId || saree.id || '').trim();
    addToCart({
      ...saree,
      productId: pid,
      categoryName: categoryName || saree.category || 'Saree Collection',
      firstImageUrl: resolvedPrimaryImg || saree.firstImageUrl || '',
      hoverImageUrl: resolvedHoverImg || saree.hoverImageUrl || ''
    });
    setJustAddedId(pid);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === pid ? '' : curr));
    }, 1600);
  };

  // Fetch live products from backend API
  const loadProductsFromBackend = useCallback(async () => {
    if (Array.isArray(sarees)) {
      setIsLoadingProducts(false);
      return;
    }
    setIsLoadingProducts(true);
    setProductsError('');
    try {
      const response = await apiFetch('/api/products', { method: 'GET' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load products.');
      }
      setDbProducts(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setProductsError(err.message || 'Unable to connect to catalog service.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [sarees]);

  useEffect(() => {
    if (Array.isArray(sarees)) return undefined;
    let isCancelled = false;
    apiFetch('/api/products', { method: 'GET' })
      .then((res) => res.json().catch(() => ({})).then((result) => ({ ok: res.ok, result })))
      .then(({ ok, result }) => {
        if (isCancelled) return;
        if (!ok || !result.success) {
          throw new Error(result.message || 'Unable to load products.');
        }
        setDbProducts(Array.isArray(result.data) ? result.data : []);
        setProductsError('');
      })
      .catch((err) => {
        if (!isCancelled) {
          setProductsError(err.message || 'Unable to connect to catalog service.');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingProducts(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [sarees]);

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
      onCategoryRouteChange(catId);
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
    onCategoryRouteChange(draftCategory);
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
    onCategoryRouteChange('all');
    notifyFilterChange('all', MIN_COST_BOUND, MAX_COST_BOUND, true);

    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      setIsMobileDrawerOpen(false);
    }
  };

  // Remove individual filter badge pills
  const handleRemoveCategoryPill = () => {
    setDraftCategory('all');
    setAppliedFilters((prev) => ({ ...prev, category: 'all' }));
    onCategoryRouteChange('all');
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

  // Update document title for dedicated category pages
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevTitle = document.title;
    document.title =
      activeCategoryObj.id === 'all'
        ? 'Our Collections | Sridevi Sarees & Collections'
        : `${activeCategoryObj.name} | Sridevi Sarees & Collections`;
    return () => {
      document.title = prevTitle;
    };
  }, [activeCategoryObj]);

  // Real sarees filtering & sorting
  const catalogSource = Array.isArray(sarees) ? sarees : dbProducts;

  const filteredSarees = useMemo(() => {
    if (!catalogSource || catalogSource.length === 0) return [];
    const filtered = catalogSource.filter((saree) => {
      const sareeCat = (saree.category || saree.categoryId || '').toLowerCase();
      if (appliedFilters.category !== 'all' && sareeCat !== appliedFilters.category) {
        return false;
      }
      const priceNum = Number(saree.cost ?? saree.price ?? 0);
      if (priceNum < appliedFilters.minCost) return false;
      if (!appliedFilters.isAbove6500 && priceNum > appliedFilters.maxCost) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => Number(a.cost ?? a.price ?? 0) - Number(b.cost ?? b.price ?? 0));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => Number(b.cost ?? b.price ?? 0) - Number(a.cost ?? a.price ?? 0));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return sorted;
  }, [catalogSource, appliedFilters, sortBy]);

  return (
    <div className="our-collections-page" id="our-collections-page">
      {/* =========================================================
          PAGE SUB-BANNER / BREADCRUMB (PER-CATEGORY DEDICATED HEADER)
          ========================================================= */}
      <section className="col-hero-banner" aria-label="Our Collections Header">
        <div className="col-hero-pattern" aria-hidden="true" />
        <div className="col-hero-inner">
          <nav className="col-hero-breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => onNavigate('home')}>
              Home
            </button>
            <span className="sep">/</span>
            {activeCategoryObj.id === 'all' ? (
              <span>Our Collections</span>
            ) : (
              <>
                <button type="button" onClick={() => onCategoryRouteChange('all')}>
                  Our Collections
                </button>
                <span className="sep">/</span>
                <span>{activeCategoryObj.name}</span>
              </>
            )}
          </nav>

          <div className="col-hero-eyebrow">
            <span>✦</span>
            <span>
              {activeCategoryObj.id === 'all'
                ? 'EXCLUSIVE WEAVES • మన కలెక్షన్స్'
                : `${activeCategoryObj.tag.toUpperCase()} • ${activeCategoryObj.telugu}`}
            </span>
            <span>✦</span>
          </div>

          <h1 className="col-hero-title">
            {activeCategoryObj.id === 'all' ? 'OUR COLLECTIONS' : activeCategoryObj.name.toUpperCase()}
          </h1>
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

            {/* Display loading / error / real products from database */}
            {isLoadingProducts ? (
              <div className="col-canvas-frame" aria-live="polite">
                <div className="col-canvas-eyebrow">
                  <span>✦</span>
                  <span>LOADING COLLECTIONS</span>
                  <span>✦</span>
                </div>
                <h3 className="col-canvas-title">Fetching {activeCategoryObj.name}...</h3>
                <p className="col-canvas-desc">
                  Please wait while we load the latest sarees from our showroom catalog.
                </p>
              </div>
            ) : productsError ? (
              <div className="col-canvas-frame" role="alert">
                <h3 className="col-canvas-title">Unable to Load Sarees</h3>
                <p className="col-canvas-desc">{productsError}</p>
                <button
                  type="button"
                  className="col-apply-btn"
                  style={{ maxWidth: '180px', margin: '0 auto' }}
                  onClick={loadProductsFromBackend}
                >
                  Try Again
                </button>
              </div>
            ) : filteredSarees.length > 0 ? (
              <div className="col-sarees-grid">
                {filteredSarees.map((saree) => {
                  const primaryImg = resolveProductImageUrl(saree.firstImageUrl);
                  const hoverImg = resolveProductImageUrl(saree.hoverImageUrl);
                  const catObj = SAREE_CATEGORIES.find(
                    (c) => c.id === (saree.category || saree.categoryId)
                  );
                  return (
                    <article key={saree.id || saree.productId} className="col-saree-card">
                      <div className="col-saree-img-wrap">
                        {primaryImg && (
                          <img
                            src={primaryImg}
                            alt={saree.name}
                            loading="lazy"
                            decoding="async"
                            className="col-saree-img col-saree-img-primary"
                          />
                        )}
                        {hoverImg && (
                          <img
                            src={hoverImg}
                            alt={`${saree.name} alternate view`}
                            loading="lazy"
                            decoding="async"
                            className="col-saree-img col-saree-img-hover"
                          />
                        )}
                        {catObj && (
                          <span className="col-saree-cat-pill">{catObj.name}</span>
                        )}
                        <button
                          type="button"
                          className={`col-saree-cart-icon-btn ${
                            cartProductIds.has(saree.productId || saree.id) ? 'in-cart' : ''
                          }`}
                          onClick={() => handleAddToCart(saree, catObj?.name, primaryImg, hoverImg)}
                          aria-label={`Add ${saree.name} to shopping bag`}
                          title={
                            justAddedId === (saree.productId || saree.id)
                              ? 'Added to bag!'
                              : 'Add to Cart'
                          }
                        >
                          {justAddedId === (saree.productId || saree.id) ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="col-saree-body">
                        {saree.productId && (
                          <span className="col-saree-code">{saree.productId}</span>
                        )}
                        <h4 className="col-saree-title">{saree.name}</h4>
                        {saree.description && (
                          <p className="col-saree-desc">{saree.description}</p>
                        )}
                        <p className="col-saree-price">
                          ₹{Number(saree.cost ?? saree.price ?? 0).toLocaleString('en-IN')}
                        </p>

                        <div className="col-saree-actions">
                          <a
                            href={buildWhatsAppProductUrl(saree, catObj?.name, 'buy')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-saree-btn col-saree-btn-buy"
                            aria-label={`Buy ${saree.name} now`}
                          >
                            Buy Now
                          </a>
                          <a
                            href={buildWhatsAppProductUrl(saree, catObj?.name, 'enquiry')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-saree-btn col-saree-btn-enquiry"
                            aria-label={`Enquiry now for ${saree.name} on WhatsApp`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12.03 2C6.51 2 2.04 6.47 2.04 12c0 1.76.46 3.48 1.34 5L2 22l5.13-1.34A9.93 9.93 0 0 0 12.03 22C17.55 22 22 17.53 22 12S17.55 2 12.03 2zm5.82 14.12c-.25.7-1.44 1.33-2 1.42-.52.08-1.18.11-1.91-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38h.58c.19 0 .44-.07.69.52.25.6.86 2.09.94 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.35.08.13.08.73-.17 1.43z" />
                            </svg>
                            <span>Enquiry Now</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /*
               * =====================================================================
               * NOTE ADHERENCE: DONT DISPLAY ANY DUMMY SAREES CONTENT
               * =====================================================================
               */
              <div className="col-canvas-frame" aria-label="No Sarees in Category">
                <div className="col-canvas-icon-wrap" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>

                <div className="col-canvas-eyebrow">
                  <span>✦</span>
                  <span>{activeCategoryObj.name.toUpperCase()}</span>
                  <span>✦</span>
                </div>

                <h3 className="col-canvas-title">No Sarees Found in {activeCategoryObj.name}</h3>

                <p className="col-canvas-desc">
                  No sarees currently match your selected category and price range (₹{appliedFilters.minCost.toLocaleString('en-IN')} – ₹{appliedFilters.maxCost.toLocaleString('en-IN')}
                  {appliedFilters.isAbove6500 && appliedFilters.maxCost >= MAX_COST_BOUND ? '+' : ''}).
                </p>

                {isFilterActive && (
                  <button
                    type="button"
                    className="col-apply-btn"
                    style={{ maxWidth: '200px', margin: '0.5rem auto 0' }}
                    onClick={handleResetFilters}
                  >
                    View All Sarees
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OurCollections;
