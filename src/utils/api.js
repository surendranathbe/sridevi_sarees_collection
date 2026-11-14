/**
 * Shared secure API client utility.
 * Reads VITE_API_URL, attaches Authorization: Bearer <token> from sessionStorage,
 * and handles HTTP 401 Unauthorized by clearing the stored session and redirecting to admin login.
 */

export const getApiBaseUrl = () => {
  return (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
};

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  }
};

export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('adminToken');
};

export const getAdminUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Standard fetch helper that attaches the Bearer token and intercepts 401 Unauthorized responses.
 *
 * @param {string} endpoint - API path (e.g. '/api/auth/verify') or absolute URL
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const primaryUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const token = getAdminToken();
  const headers = new Headers(options.headers || {});

  const isAdminRoute = endpoint.includes('/admin') || endpoint.includes('/api/auth/verify') || Boolean(options.requireAuth);

  if (isAdminRoute && token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(primaryUrl, {
      ...options,
      headers
    });
  } catch (err) {
    // Fallback to relative proxy route if direct call to baseUrl fails
    if (baseUrl && !endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
      const relativeUrl = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      response = await fetch(relativeUrl, {
        ...options,
        headers
      });
    } else {
      throw err;
    }
  }

  if (response.status === 401 && isAdminRoute) {
    clearAdminSession();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-auth-expired'));
      const isAlreadyOnAdminPage = window.location.pathname.includes('/admin') ||
        window.location.pathname.includes('/admindashboard') ||
        window.location.hash === '#admin-login';
      if (!isAlreadyOnAdminPage) {
        window.location.hash = '#admin-login';
      }
    }
  }

  return response;
};

/**
 * Validates and uploads an image file to /api/admin/uploads.
 * Client-side checks: allows strictly JPEG, PNG, and WebP up to 5 MB.
 * Returns the resolved full URL for display.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export const uploadImageFile = async (file) => {
  if (!file) {
    throw new Error('No file selected.');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const hasAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name);
  const isSvg = file.type?.toLowerCase().includes('svg') || /\.svg$/i.test(file.name);

  if (isSvg || (!allowedTypes.includes(file.type?.toLowerCase()) && !hasAllowedExt)) {
    throw new Error('Invalid file format. Only JPG, PNG, and WebP images are permitted (SVG is blocked).');
  }

  if (file.size > 5 * 1024 * 1024) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File size too large (${sizeMB} MB). Maximum allowed size is 5 MB.`);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch('/api/admin/uploads', {
    method: 'POST',
    body: formData
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(result.message || 'Failed to upload image to server.');
  }

  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${result.data.url}`;
};

export default apiFetch;

