import React, { useState, useRef } from 'react';
import {
  PRODUCT_GRID_CONFIGS,
  DEFAULT_GRID_VIEW,
  EMPTY_PRODUCT_FORM,
  validateProductForm,
  formatIndianCurrency
} from '../data/products';

/**
 * Products Management Component
 * Dedicated module for viewing, filtering grids, creating, and editing saree products.
 * Supports image URLs and direct file uploads from the user's system.
 */
const Products = ({
  productsList = [],
  setProductsList,
  setNotification
}) => {
  // Grid layout selection state
  const [selectedGrid, setSelectedGrid] = useState(DEFAULT_GRID_VIEW);

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT_FORM);
  const [formErrors, setFormErrors] = useState({});

  // File input refs for uploading from system
  const firstImageFileRef = useRef(null);
  const hoverImageFileRef = useRef(null);

  // Open modal in Add mode
  const handleOpenAdd = () => {
    setFormData(EMPTY_PRODUCT_FORM);
    setFormErrors({});
    setFormMode('add');
    setEditingOriginalId(null);
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEdit = (product) => {
    setFormData({
      productId: product.productId || '',
      name: product.name || '',
      description: product.description || '',
      firstImageUrl: product.firstImageUrl || '',
      hoverImageUrl: product.hoverImageUrl || '',
      cost: product.cost !== undefined ? String(product.cost) : ''
    });
    setFormErrors({});
    setFormMode('edit');
    setEditingOriginalId(product.productId);
    setIsModalOpen(true);
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_PRODUCT_FORM);
    setFormErrors({});
    setEditingOriginalId(null);
    if (firstImageFileRef.current) firstImageFileRef.current.value = '';
    if (hoverImageFileRef.current) hoverImageFileRef.current.value = '';
  };

  // Handle standard text / textarea / number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle file uploads directly from the user's computer
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: 'Please select a valid image file (PNG, JPG, WEBP, etc.)'
      }));
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: 'Image size must be less than 5MB.'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: dataUrl
      }));
      if (formErrors[fieldName]) {
        setFormErrors((prev) => ({ ...prev, [fieldName]: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Clear chosen image
  const handleClearImage = (fieldName, ref) => {
    setFormData((prev) => ({ ...prev, [fieldName]: '' }));
    if (ref && ref.current) {
      ref.current.value = '';
    }
  };

  // Handle form submission (validation, create, update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const formattedProduct = {
      productId: formData.productId.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      firstImageUrl: formData.firstImageUrl.trim(),
      hoverImageUrl: formData.hoverImageUrl.trim(),
      cost: Number(formData.cost)
    };

    if (formMode === 'edit') {
      // Check if product ID was changed to an existing ID
      if (formattedProduct.productId !== editingOriginalId) {
        const conflict = productsList.some((p) => p.productId === formattedProduct.productId);
        if (conflict) {
          setFormErrors({ productId: 'Another product with this ID already exists.' });
          return;
        }
      }

      setProductsList((prev) =>
        prev.map((item) =>
          item.productId === editingOriginalId ? formattedProduct : item
        )
      );

      if (setNotification) {
        setNotification({
          type: 'success',
          text: `Product "${formattedProduct.name}" updated successfully.`
        });
      }
    } else {
      // Validate uniqueness of new product ID
      const conflict = productsList.some((p) => p.productId === formattedProduct.productId);
      if (conflict) {
        setFormErrors({ productId: 'A product with this ID already exists.' });
        return;
      }

      setProductsList((prev) => [formattedProduct, ...prev]);

      if (setNotification) {
        setNotification({
          type: 'success',
          text: `Product "${formattedProduct.name}" added to catalog.`
        });
      }
    }

    handleCloseModal();
  };

  // Delete product with confirmation
  const handleDeleteProduct = (productId, productName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${productName}" (ID: ${productId}) from the catalog?`
    );
    if (!isConfirmed) return;

    setProductsList((prev) => prev.filter((item) => item.productId !== productId));
    if (setNotification) {
      setNotification({
        type: 'success',
        text: `Product "${productName}" was removed from the catalog.`
      });
    }
  };

  return (
    <section className="admin-products-section" aria-label="Products Management">
      {/* 1. Header Action Bar */}
      <div className="admin-products-header-bar">
        <div className="admin-products-title-group">
          <h2 className="admin-products-title">Products</h2>
          {productsList.length > 0 && (
            <span className="admin-products-count-badge">
              {productsList.length} {productsList.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        <div className="admin-products-actions-group">
          {/* Compact Grid View Switcher Controls */}
          <div className="admin-grid-control" role="group" aria-label="Product grid layout">
            {PRODUCT_GRID_CONFIGS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`admin-grid-btn ${selectedGrid === opt.id ? 'active' : ''}`}
                onClick={() => setSelectedGrid(opt.id)}
                aria-pressed={selectedGrid === opt.id}
                title={`Switch to ${opt.label} view`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* + Add Product Button */}
          <button
            type="button"
            className="admin-btn-wine admin-btn-add-product"
            onClick={handleOpenAdd}
          >
            <span>＋</span> Add Product
          </button>
        </div>
      </div>

      {/* 2. Products Display (Empty State / 1x1 Table View / 2x2, 4x4, 6x6 Grid Views) */}
      {productsList.length === 0 ? (
        <div className="admin-products-empty-state">
          <div className="admin-products-empty-icon">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 className="admin-products-empty-title">No Products in Catalog</h3>
          <p className="admin-products-empty-desc">
            There are currently no products configured in the showroom catalog. Click below to add your first saree.
          </p>
          <button
            type="button"
            className="admin-btn-wine"
            onClick={handleOpenAdd}
          >
            <span>＋</span> Add Product
          </button>
        </div>
      ) : selectedGrid === '1x1' ? (
        /* =========================================================
           1 × 1 TABLE VIEW FORMAT
           ========================================================= */
        <div className="admin-products-table-card">
          <div className="admin-products-table-responsive">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Image</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => (
                  <tr key={product.productId}>
                    {/* First & Hover Image Cell */}
                    <td>
                      <div className="admin-table-img-cell" title={`${product.name} (Hover for alternate view)`}>
                        <img
                          src={product.firstImageUrl}
                          alt={product.name}
                          className="admin-table-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {product.hoverImageUrl && (
                          <img
                            src={product.hoverImageUrl}
                            alt={`${product.name} alternate view`}
                            className="admin-table-img admin-table-img-hover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </td>

                    {/* Product ID */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="admin-product-id-badge">
                        {product.productId}
                      </span>
                    </td>

                    {/* Name of Product */}
                    <td>
                      <strong className="admin-table-name">{product.name}</strong>
                    </td>

                    {/* Description */}
                    <td>
                      <div className="admin-table-desc" title={product.description || 'No description provided'}>
                        {product.description || '—'}
                      </div>
                    </td>

                    {/* Cost */}
                    <td>
                      <span className="admin-table-cost">
                        {formatIndianCurrency(product.cost)}
                      </span>
                    </td>

                    {/* Actions: Edit and Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="admin-product-edit-btn"
                          onClick={() => handleOpenEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-product-delete-btn"
                          onClick={() => handleDeleteProduct(product.productId, product.name)}
                          aria-label={`Delete ${product.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* =========================================================
           GRID CARD VIEWS (2x2, 4x4, 6x6)
           ========================================================= */
        <div className={`admin-products-grid admin-products-grid-${selectedGrid}`}>
          {productsList.map((product) => (
            <article key={product.productId} className="admin-product-card">
              {/* Product Image Container with Subtle Hover Crossfade */}
              <div className="admin-product-img-container">
                <img
                  src={product.firstImageUrl}
                  alt={product.name}
                  className="admin-product-img admin-product-img-primary"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('has-fallback');
                  }}
                />
                {product.hoverImageUrl && (
                  <img
                    src={product.hoverImageUrl}
                    alt={`${product.name} alternate view`}
                    className="admin-product-img admin-product-img-hover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="admin-product-img-fallback" aria-hidden="true">
                  <span>Sridevi Sarees</span>
                </div>
              </div>

              {/* Product Card Body */}
              <div className="admin-product-body">
                <div className="admin-product-meta-row">
                  <span className="admin-product-id-badge" title={`Product ID: ${product.productId}`}>
                    ID: {product.productId}
                  </span>
                  <span className="admin-product-cost">
                    {formatIndianCurrency(product.cost)}
                  </span>
                </div>

                <h3 className="admin-product-name" title={product.name}>
                  {product.name}
                </h3>

                {product.description && (
                  <p className="admin-product-desc" title={product.description}>
                    {product.description}
                  </p>
                )}

                <div className="admin-product-footer">
                  <button
                    type="button"
                    className="admin-product-edit-btn"
                    onClick={() => handleOpenEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-product-delete-btn"
                    onClick={() => handleDeleteProduct(product.productId, product.name)}
                    aria-label={`Delete ${product.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 3. Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div className="admin-modal-header">
              <h3 id="product-modal-title" className="admin-modal-title">
                {formMode === 'edit' ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form" noValidate>
              {/* Field 1: Product ID */}
              <div className="admin-form-group">
                <label htmlFor="modal-product-id" className="admin-form-label">
                  <span>
                    Product ID <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-product-id"
                  name="productId"
                  type="text"
                  className={`admin-form-input ${formErrors.productId ? 'input-error' : ''}`}
                  placeholder="e.g. SR-KAN-001"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.productId && (
                  <span className="admin-form-error-msg">{formErrors.productId}</span>
                )}
              </div>

              {/* Field 2: Name of the Product */}
              <div className="admin-form-group">
                <label htmlFor="modal-product-name" className="admin-form-label">
                  <span>
                    Name of the Product <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-product-name"
                  name="name"
                  type="text"
                  className={`admin-form-input ${formErrors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Pure Kanchipuram Gold Zari Silk Saree"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.name && (
                  <span className="admin-form-error-msg">{formErrors.name}</span>
                )}
              </div>

              {/* Field 3: Description */}
              <div className="admin-form-group">
                <label htmlFor="modal-product-desc" className="admin-form-label">
                  <span>Description</span>
                </label>
                <textarea
                  id="modal-product-desc"
                  name="description"
                  rows="3"
                  className="admin-form-textarea"
                  placeholder="Enter saree weave details, silk grade, border and pallu design..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Fields 4 & 5: Side-by-side Image URLs with System File Uploading */}
              <div className="admin-form-row-2 admin-images-row">
                {/* First Image Field */}
                <div className="admin-form-group">
                  <label htmlFor="modal-product-first-img" className="admin-form-label">
                    <span>
                      First Image URL <span className="admin-form-label-required">*</span>
                    </span>
                  </label>

                  <div className="admin-image-input-container">
                    <input
                      id="modal-product-first-img"
                      name="firstImageUrl"
                      type="text"
                      className={`admin-form-input ${formErrors.firstImageUrl ? 'input-error' : ''}`}
                      placeholder="Paste image URL or upload from system"
                      value={formData.firstImageUrl}
                      onChange={handleInputChange}
                      required
                    />

                    <label className="admin-upload-btn-label" title="Upload image from computer">
                      <input
                        ref={firstImageFileRef}
                        type="file"
                        accept="image/*"
                        className="admin-hidden-file-input"
                        onChange={(e) => handleFileUpload(e, 'firstImageUrl')}
                      />
                      <span className="admin-upload-btn">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload
                      </span>
                    </label>
                  </div>

                  {formData.firstImageUrl && (
                    <div className="admin-image-preview-chip">
                      <img
                        src={formData.firstImageUrl}
                        alt="First preview"
                        className="admin-image-preview-thumb"
                      />
                      <span className="admin-image-preview-text">
                        {formData.firstImageUrl.startsWith('data:') ? 'Uploaded from system' : formData.firstImageUrl}
                      </span>
                      <button
                        type="button"
                        className="admin-image-remove-btn"
                        onClick={() => handleClearImage('firstImageUrl', firstImageFileRef)}
                        title="Remove image"
                        aria-label="Remove first image"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {formErrors.firstImageUrl && (
                    <span className="admin-form-error-msg">{formErrors.firstImageUrl}</span>
                  )}
                </div>

                {/* Hover Image Field */}
                <div className="admin-form-group">
                  <label htmlFor="modal-product-hover-img" className="admin-form-label">
                    <span>Hover Image URL</span>
                  </label>

                  <div className="admin-image-input-container">
                    <input
                      id="modal-product-hover-img"
                      name="hoverImageUrl"
                      type="text"
                      className="admin-form-input"
                      placeholder="Paste image URL or upload from system"
                      value={formData.hoverImageUrl}
                      onChange={handleInputChange}
                    />

                    <label className="admin-upload-btn-label" title="Upload hover image from computer">
                      <input
                        ref={hoverImageFileRef}
                        type="file"
                        accept="image/*"
                        className="admin-hidden-file-input"
                        onChange={(e) => handleFileUpload(e, 'hoverImageUrl')}
                      />
                      <span className="admin-upload-btn">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload
                      </span>
                    </label>
                  </div>

                  {formData.hoverImageUrl && (
                    <div className="admin-image-preview-chip">
                      <img
                        src={formData.hoverImageUrl}
                        alt="Hover preview"
                        className="admin-image-preview-thumb"
                      />
                      <span className="admin-image-preview-text">
                        {formData.hoverImageUrl.startsWith('data:') ? 'Uploaded from system' : formData.hoverImageUrl}
                      </span>
                      <button
                        type="button"
                        className="admin-image-remove-btn"
                        onClick={() => handleClearImage('hoverImageUrl', hoverImageFileRef)}
                        title="Remove hover image"
                        aria-label="Remove hover image"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {formErrors.hoverImageUrl && (
                    <span className="admin-form-error-msg">{formErrors.hoverImageUrl}</span>
                  )}
                </div>
              </div>

              {/* Field 6: Cost */}
              <div className="admin-form-group">
                <label htmlFor="modal-product-cost" className="admin-form-label">
                  <span>
                    Cost (₹) <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-product-cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="1"
                  className={`admin-form-input ${formErrors.cost ? 'input-error' : ''}`}
                  placeholder="e.g. 18500"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.cost && (
                  <span className="admin-form-error-msg">{formErrors.cost}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-wine">
                  {formMode === 'edit' ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
