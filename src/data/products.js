/**
 * Sridevi Sarees & Collections - Products Management Data & Configuration
 * File: src/data/products.js
 */

// Available Grid View Configurations
export const PRODUCT_GRID_CONFIGS = [
  { id: '1x1', label: '1 × 1', columns: 1, classSuffix: '1x1' },
  { id: '2x2', label: '2 × 2', columns: 2, classSuffix: '2x2' },
  { id: '4x4', label: '4 × 4', columns: 4, classSuffix: '4x4' },
  { id: '6x6', label: '6 × 6', columns: 6, classSuffix: '6x6' }
];

export const DEFAULT_GRID_VIEW = '4x4';

/**
 * Authentic Saree Categories matching our-collections.jsx
 */
export const SAREE_CATEGORIES = [
  { id: 'all', name: 'All Sarees', telugu: 'అన్ని చీరలు', tag: 'All Weaves', prefix: 'saree' },
  { id: 'royal-dola-silk', name: 'Royal Dola Silk', telugu: 'రాయల్ డోలా సిల్క్', tag: 'Festive Classic', prefix: 'dola' },
  { id: 'banarasi-silk', name: 'Banarasi Silk', telugu: 'బనారసి సిల్క్', tag: 'Zari Brocade', prefix: 'banarasi' },
  { id: 'uppada-silk', name: 'Uppada Silk', telugu: 'ఉప్పాడ పట్టు', tag: 'Jamdani Pure', prefix: 'uppada' },
  { id: 'mangalagiri-pattu', name: 'Mangalagiri Pattu', telugu: 'మంగళగిరి పట్టు', tag: 'Nizam Border', prefix: 'mangalagiri' },
  { id: 'pure-handloom', name: 'Pure Handloom Sarees', telugu: 'చేనేత చీరలు', tag: 'Artisan Pride', prefix: 'handloom' },
  { id: 'designer-silk', name: 'Designer Silk Sarees', telugu: 'డిజైనర్ సిల్క్', tag: 'Party Drapes', prefix: 'designer' },
  { id: 'organza-tissue', name: 'Organza & Tissue Sarees', telugu: 'ఆర్గాన్జా సిల్క్', tag: 'Sheer Glow', prefix: 'organza' },
  { id: 'chanderi-maheshwari', name: 'Chanderi & Maheshwari', telugu: 'మహేశ్వరి సిల్క్', tag: 'Royal Weave', prefix: 'chanderi' },
  { id: 'chiffon-georgette', name: 'Chiffon & Georgette', telugu: 'షిఫాన్ & జార్జెట్', tag: 'Lightweight', prefix: 'chiffon' },
  { id: 'pure-cotton', name: 'Pure Cotton Sarees', telugu: 'ప్యూర్ కాటన్', tag: 'Daily Comfort', prefix: 'cotton' }
];

/**
 * Generates the next sequential Product ID for a category (e.g., "dola-01", "dola-02").
 * @param {string} categoryId
 * @param {Array<object>} existingProducts
 * @returns {string}
 */
export function generateNextCategoryProductId(categoryId, existingProducts = []) {
  const cat = SAREE_CATEGORIES.find((c) => c.id === categoryId && c.id !== 'all');
  if (!cat || !cat.prefix) return '';

  const prefix = cat.prefix;
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^${escaped}-(\\d+)$`, 'i');

  let maxNum = 0;
  for (const item of existingProducts || []) {
    const pid = (item?.productId || '').trim();
    const match = pid.match(pattern);
    if (match) {
      const n = parseInt(match[1], 10);
      if (!Number.isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(2, '0')}`;
}

// Blank initial form state for adding/editing products
export const EMPTY_PRODUCT_FORM = {
  productId: '',
  name: '',
  category: '',
  description: '',
  firstImageUrl: '',
  hoverImageUrl: '',
  cost: ''
};

/**
 * Validates product form fields
 * @param {object} form
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateProductForm(form) {
  const errors = {};

  if (!form.productId || !form.productId.trim()) {
    errors.productId = 'Product ID is required.';
  }

  if (!form.name || !form.name.trim()) {
    errors.name = 'Product name is required.';
  }

  if (!form.category || !form.category.trim()) {
    errors.category = 'Please select a saree category.';
  }

  if (!form.firstImageUrl || !form.firstImageUrl.trim()) {
    errors.firstImageUrl = 'First image URL is required.';
  }

  if (form.cost === '' || form.cost === null || form.cost === undefined) {
    errors.cost = 'Product cost is required.';
  } else if (Number.isNaN(Number(form.cost)) || Number(form.cost) < 0) {
    errors.cost = 'Please enter a valid positive cost.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Formats numeric price into Indian Rupee standard format
 * @param {number|string} amount
 * @returns {string}
 */
export function formatIndianCurrency(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
}

// Blank initial form state for adding/editing embroidery designs
export const EMPTY_EMBROIDERY_FORM = {
  id: '',
  name: '',
  description: '',
  imageUrl: '',
  cost: ''
};

/**
 * Validates embroidery design form fields
 * @param {object} form
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateEmbroideryForm(form) {
  const errors = {};

  if (!form.id || !form.id.trim()) {
    errors.id = 'Design ID is required.';
  }

  if (!form.name || !form.name.trim()) {
    errors.name = 'Name of the design is required.';
  }

  if (!form.imageUrl || !form.imageUrl.trim()) {
    errors.imageUrl = 'Image URL or file upload is required.';
  }

  if (form.cost === '' || form.cost === null || form.cost === undefined) {
    errors.cost = 'Cost is required.';
  } else if (Number.isNaN(Number(form.cost)) || Number(form.cost) < 0) {
    errors.cost = 'Please enter a valid positive cost.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
