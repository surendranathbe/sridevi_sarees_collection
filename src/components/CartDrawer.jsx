import React, { useState, useEffect } from 'react';
import {
  getCartItems,
  getCartTotalCount,
  getCartSubtotal,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  CART_UPDATE_EVENT,
  CART_OPEN_EVENT
} from '../utils/cart';

const STORE_WHATSAPP_NUMBER = '919849837338';

const buildCartWhatsAppUrl = (items, subtotal) => {
  const lines = [
    'Namaskaram Sridevi Sarees & Collections! 🙏',
    '',
    '*Shopping Bag Order Request*',
    ''
  ];

  items.forEach((item, index) => {
    const unitPrice = Number(item.cost || 0);
    const qty = Number(item.quantity || 1);
    const lineTotal = unitPrice * qty;
    lines.push(
      `${index + 1}. *${item.name}*`,
      `   • Product ID: ${item.productId}`,
      `   • Category: ${item.categoryName || item.category || 'Saree'}`,
      `   • Quantity: ${qty} × ₹${unitPrice.toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}`,
      ...(item.description ? [`   • Details: ${item.description}`] : []),
      ''
    );
  });

  lines.push(
    `*Total Items:* ${getCartTotalCount(items)}`,
    `*Estimated Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`,
    '',
    'Please confirm availability and share payment & delivery details.'
  );

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
};

const CartDrawer = ({ onNavigate = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(() => getCartItems());

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());
    const handleOpen = () => {
      syncCart();
      setIsOpen(true);
    };

    window.addEventListener(CART_UPDATE_EVENT, syncCart);
    window.addEventListener(CART_OPEN_EVENT, handleOpen);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, syncCart);
      window.removeEventListener(CART_OPEN_EVENT, handleOpen);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = getCartTotalCount(items);
  const subtotal = getCartSubtotal(items);

  return (
    <div
      className="sc-cart-overlay"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <aside className="sc-cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="sc-cart-header">
          <div className="sc-cart-header-left">
            <span className="sc-cart-header-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <div>
              <h2 className="sc-cart-title">Your Shopping Bag</h2>
              <p className="sc-cart-subtitle">
                {totalCount} {totalCount === 1 ? 'Saree' : 'Sarees'} Selected
              </p>
            </div>
          </div>

          <button
            type="button"
            className="sc-cart-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close shopping bag"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="sc-cart-body">
          {items.length === 0 ? (
            <div className="sc-cart-empty">
              <div className="sc-cart-empty-icon" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="sc-cart-empty-title">Your Bag is Empty</h3>
              <p className="sc-cart-empty-desc">
                Explore our pure silks, handlooms, and bridal drapes and click the cart icon on any saree to save it here.
              </p>
              <button
                type="button"
                className="sc-cart-browse-btn"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('collections');
                }}
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <ul className="sc-cart-items-list">
              {items.map((item) => {
                const unitPrice = Number(item.cost || 0);
                const qty = Number(item.quantity || 1);
                const lineTotal = unitPrice * qty;

                return (
                  <li key={item.productId} className="sc-cart-item-card">
                    <div className="sc-cart-item-thumb-wrap">
                      {item.firstImageUrl ? (
                        <img
                          src={item.firstImageUrl}
                          alt={item.name}
                          className="sc-cart-item-thumb"
                          loading="lazy"
                        />
                      ) : (
                        <div className="sc-cart-item-thumb-fallback">Saree</div>
                      )}
                    </div>

                    <div className="sc-cart-item-info">
                      <div className="sc-cart-item-badges">
                        <span className="sc-cart-item-id">{item.productId}</span>
                        {item.categoryName && (
                          <span className="sc-cart-item-cat">{item.categoryName}</span>
                        )}
                      </div>

                      <h4 className="sc-cart-item-name">{item.name}</h4>

                      {item.description && (
                        <p className="sc-cart-item-desc" title={item.description}>
                          {item.description}
                        </p>
                      )}

                      <div className="sc-cart-item-price-row">
                        <span className="sc-cart-item-unit">
                          ₹{unitPrice.toLocaleString('en-IN')} × {qty}
                        </span>
                        <span className="sc-cart-item-total">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="sc-cart-item-controls">
                        <div className="sc-cart-qty-stepper" aria-label={`Quantity for ${item.name}`}>
                          <button
                            type="button"
                            className="sc-cart-qty-btn"
                            onClick={() => updateCartQuantity(item.productId, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="sc-cart-qty-val">{qty}</span>
                          <button
                            type="button"
                            className="sc-cart-qty-btn"
                            onClick={() => updateCartQuantity(item.productId, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="sc-cart-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="sc-cart-footer">
            <div className="sc-cart-summary-row">
              <span className="sc-cart-summary-lbl">
                Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'})
              </span>
              <span className="sc-cart-summary-val">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="sc-cart-footer-actions">
              <a
                href={buildCartWhatsAppUrl(items, subtotal)}
                target="_blank"
                rel="noopener noreferrer"
                className="sc-cart-whatsapp-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.03 2C6.51 2 2.04 6.47 2.04 12c0 1.76.46 3.48 1.34 5L2 22l5.13-1.34A9.93 9.93 0 0 0 12.03 22C17.55 22 22 17.53 22 12S17.55 2 12.03 2zm5.82 14.12c-.25.7-1.44 1.33-2 1.42-.52.08-1.18.11-1.91-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38h.58c.19 0 .44-.07.69.52.25.6.86 2.09.94 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.35.08.13.08.73-.17 1.43z" />
                </svg>
                <span>Order All via WhatsApp</span>
              </a>

              <div className="sc-cart-secondary-row">
                <button
                  type="button"
                  className="sc-cart-continue-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  className="sc-cart-clear-btn"
                  onClick={clearCart}
                >
                  Clear Bag
                </button>
              </div>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
