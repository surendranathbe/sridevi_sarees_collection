/**
 * Shared Cart Storage & Event Synchronization Utility
 * Persists full saree product details in localStorage and broadcasts updates across components.
 */

export const CART_STORAGE_KEY = 'sridevi_sarees_cart';
export const CART_UPDATE_EVENT = 'sridevi-cart-updated';
export const CART_OPEN_EVENT = 'sridevi-cart-open';

const safeReadCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeWriteCart = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, { detail: items }));
  } catch {
    // Ignore storage quota errors
  }
};

export const getCartItems = () => safeReadCart();

export const getCartTotalCount = (items = safeReadCart()) =>
  items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

export const getCartSubtotal = (items = safeReadCart()) =>
  items.reduce((sum, item) => sum + (Number(item.cost) || 0) * (Number(item.quantity) || 1), 0);

export const addToCart = (product) => {
  if (!product) return [];
  const productId = (product.productId || product.id || '').trim();
  if (!productId) return safeReadCart();

  const current = safeReadCart();
  const existingIdx = current.findIndex((item) => item.productId === productId);

  let updated;
  if (existingIdx >= 0) {
    updated = current.map((item, idx) =>
      idx === existingIdx ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item
    );
  } else {
    const newItem = {
      productId,
      name: (product.name || 'Saree').trim(),
      category: product.category || product.categoryId || '',
      categoryName: product.categoryName || product.category || 'Saree Collection',
      description: product.description || '',
      firstImageUrl: product.firstImageUrl || '',
      hoverImageUrl: product.hoverImageUrl || '',
      cost: Number(product.cost ?? product.price ?? 0),
      quantity: 1,
      addedAt: new Date().toISOString()
    };
    updated = [newItem, ...current];
  }

  safeWriteCart(updated);
  return updated;
};

export const updateCartQuantity = (productId, delta) => {
  const current = safeReadCart();
  const updated = current
    .map((item) => {
      if (item.productId !== productId) return item;
      const nextQty = (Number(item.quantity) || 1) + delta;
      return nextQty > 0 ? { ...item, quantity: nextQty } : null;
    })
    .filter(Boolean);

  safeWriteCart(updated);
  return updated;
};

export const removeFromCart = (productId) => {
  const current = safeReadCart();
  const updated = current.filter((item) => item.productId !== productId);
  safeWriteCart(updated);
  return updated;
};

export const clearCart = () => {
  safeWriteCart([]);
  return [];
};

export const openCartDrawer = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
  }
};
