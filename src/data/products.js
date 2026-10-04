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

// Blank initial form state for adding/editing products
export const EMPTY_PRODUCT_FORM = {
  productId: '',
  name: '',
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
