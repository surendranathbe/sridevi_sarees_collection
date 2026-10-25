/**
 * Sridevi Sarees & Collections - Website Changes & Banner Configuration Data
 * File: src/data/bannerContent.js
 * 
 * Provides shared state, validation, default presets, and persistence methods (localStorage + events)
 * connecting both the Admin Website Changes editor and the storefront SareeHero banner component.
 */

// Storage keys for persistence
export const STORAGE_KEY_PUBLISHED = 'sridevi_published_banner';
export const STORAGE_KEY_DRAFT = 'sridevi_draft_banner';
export const BANNER_UPDATE_EVENT = 'sridevi-banner-updated';

// 10 Customer-Facing Website Sections supported by the CMS Architecture
export const WEBSITE_SECTIONS = [
  {
    id: 'hero-banner',
    title: 'Home Page Banner',
    shortName: 'Hero Banner',
    icon: '✨',
    description: 'Hero carousel banner slides, promotional tags, headings, CTAs & showcase imagery.',
    isImplemented: true,
    badge: 'Fully Configured'
  },
  {
    id: 'navbar',
    title: 'Navigation Bar',
    shortName: 'Navbar',
    icon: '🧭',
    description: 'Header logo, navigation menu links, contact hotline numbers, and catalog badges.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'announcement-bar',
    title: 'Announcement Bar',
    shortName: 'Announcement',
    icon: '📢',
    description: 'Top promotional ticker, festive showroom sale notices, and discount tickers.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'about-us',
    title: 'About Us Section',
    shortName: 'About Us',
    icon: '🏛️',
    description: 'Heritage storytelling, Kandukur showroom legacy, master weaver credentials, and store imagery.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'products-section',
    title: 'Products Section',
    shortName: 'Products',
    icon: '🥻',
    description: 'Featured saree categories, occasion filter tabs, pricing badges, and collection grids.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'brands-section',
    title: 'Brands Section',
    shortName: 'Silk Brands',
    icon: '🏷️',
    description: 'Certified silk marks, authentic handloom certifications, and partner weaver seals.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'embroidery-services',
    title: 'Embroidery Services Section',
    shortName: 'Embroidery',
    icon: '🪡',
    description: 'Computer embroidery blouse pricing, keyhole designs, zardosi works, and consultation booking.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'testimonials',
    title: 'Customer Testimonials',
    shortName: 'Reviews',
    icon: '💬',
    description: 'Client bridal reviews, Kandukur showroom customer testimonials, and 5-star ratings.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'contact-info',
    title: 'Contact Information',
    shortName: 'Contact',
    icon: '📞',
    description: 'Kandukur showroom address, Kovur Road landmark, WhatsApp number, opening hours, and Google Map.',
    isImplemented: false,
    badge: 'Coming Soon'
  },
  {
    id: 'footer-section',
    title: 'Footer Section',
    shortName: 'Footer',
    icon: '📜',
    description: 'Copyright notices, social media handles, quick links, and developer credentials.',
    isImplemented: false,
    badge: 'Coming Soon'
  }
];

// Recommended Banner Specifications
export const BANNER_RECOMMENDED_SPECS = {
  desktopWidth: 1920,
  desktopHeight: 850,
  mobileWidth: 800,
  mobileHeight: 1000,
  maxFileSizeMB: 4,
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// Default Factory Banner Configuration for Sridevi Sarees & Collections
export const DEFAULT_BANNER_CONFIG = {
  // Content
  title: 'Silk Sarees',
  subtitle: 'Dola Silk • Kanchipuram • Banarasi • Pure Silk',
  subheadline: 'Pure Kanchipuram, Banarasi & Dola Silk',
  description: 'Experience regal grace with our authentic silk collection, hand-woven with shimmering zari borders and time-honored heritage motifs.',
  tag: 'PREMIUM COLLECTION',
  
  // Call to Action Buttons
  primaryButtonText: 'EXPLORE COLLECTION',
  primaryButtonUrl: '#collection-anchor',
  secondaryButtonText: 'View All Sarees',
  secondaryButtonUrl: '#view-all',
  
  // Imagery
  desktopImage: 'src/assets/silk-sarees-banner1.png',
  mobileImage: '',
  imageAlt: 'Sridevi Sarees & Collections Pure Silk Showcase Banner',
  
  // Styling & Display
  textAlign: 'left', // 'left' | 'center' | 'right'
  textColorTheme: 'gold-ivory', // 'gold-ivory' | 'pure-white' | 'royal-crimson'
  overlayColor: '#1a050d',
  overlayOpacity: 0.25, // 0 to 0.8
  isVisible: true,
  
  // Metadata
  version: 1,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Sridevi Administrator'
};

/**
 * Validates the Banner Form input before saving draft or publishing.
 * @param {object} form
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateBannerForm(form) {
  const errors = {};

  if (!form.title || !form.title.trim()) {
    errors.title = 'Main heading title is required.';
  } else if (form.title.trim().length > 60) {
    errors.title = 'Title should not exceed 60 characters.';
  }

  if (!form.subheadline || !form.subheadline.trim()) {
    errors.subheadline = 'Subheadline is required for storefront presentation.';
  }

  if (!form.description || !form.description.trim()) {
    errors.description = 'Banner description text is required.';
  }

  if (!form.primaryButtonText || !form.primaryButtonText.trim()) {
    errors.primaryButtonText = 'Primary button text is required.';
  }

  if (!form.primaryButtonUrl || !form.primaryButtonUrl.trim()) {
    errors.primaryButtonUrl = 'Primary button URL or anchor is required.';
  }

  if (!form.desktopImage || !form.desktopImage.trim()) {
    errors.desktopImage = 'Desktop banner image is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates uploaded image file against allowed mime types and size limits.
 * @param {File} file
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateBannerImageFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const isValidType = BANNER_RECOMMENDED_SPECS.allowedMimeTypes.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isValidType) {
    return {
      isValid: false,
      error: `Invalid file format (${file.name}). Please upload JPG, PNG, or WebP.`
    };
  }

  const maxSizeBytes = BANNER_RECOMMENDED_SPECS.maxFileSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size too large (${sizeInMB} MB). Maximum allowed size is ${BANNER_RECOMMENDED_SPECS.maxFileSizeMB} MB.`
    };
  }

  return { isValid: true };
}

/**
 * Reads published banner configuration from localStorage with fallback to default.
 * @returns {object}
 */
export function getPublishedBanner() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PUBLISHED);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_BANNER_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('[WebsiteChanges] Failed to parse published banner from storage:', err);
  }
  return { ...DEFAULT_BANNER_CONFIG };
}

/**
 * Reads draft banner configuration from localStorage with fallback to published or default.
 * @returns {object}
 */
export function getDraftBanner() {
  try {
    const rawDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (rawDraft) {
      const parsed = JSON.parse(rawDraft);
      return { ...DEFAULT_BANNER_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('[WebsiteChanges] Failed to parse draft banner from storage:', err);
  }
  return getPublishedBanner();
}

/**
 * Saves current banner data as draft.
 * @param {object} bannerData
 * @returns {boolean}
 */
export function saveDraftBanner(bannerData) {
  try {
    const payload = {
      ...bannerData,
      isDraft: true,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('[WebsiteChanges] Failed to save draft banner:', err);
    return false;
  }
}

/**
 * Publishes banner data, persisting to published storage, clearing draft,
 * and dispatching a browser-wide event so the storefront updates immediately.
 * @param {object} bannerData
 * @returns {boolean}
 */
export function publishBanner(bannerData) {
  try {
    const payload = {
      ...bannerData,
      isDraft: false,
      publishedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(payload));
    localStorage.removeItem(STORAGE_KEY_DRAFT);

    // Notify all active components (including SareeHero in customer view)
    window.dispatchEvent(new CustomEvent(BANNER_UPDATE_EVENT, { detail: payload }));
    return true;
  } catch (err) {
    console.error('[WebsiteChanges] Failed to publish banner:', err);
    return false;
  }
}

/**
 * Restores banner configuration to factory defaults.
 * @returns {boolean}
 */
export function resetBannerDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(DEFAULT_BANNER_CONFIG));
    window.dispatchEvent(new CustomEvent(BANNER_UPDATE_EVENT, { detail: DEFAULT_BANNER_CONFIG }));
    return true;
  } catch (err) {
    console.error('[WebsiteChanges] Failed to reset banner defaults:', err);
    return false;
  }
}
