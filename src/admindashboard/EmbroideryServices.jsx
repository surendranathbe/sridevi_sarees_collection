import React, { useState, useRef } from 'react';
import {
  PRODUCT_GRID_CONFIGS,
  DEFAULT_GRID_VIEW,
  EMPTY_EMBROIDERY_FORM,
  validateEmbroideryForm,
  formatIndianCurrency
} from '../data/products';

/**
 * EmbroideryServices Component
 * Dedicated module for managing computer embroidery patterns, blouse works, and custom stitching designs.
 * Supports image URLs, direct system file uploads, grid switching (1x1 table, 2x2, 4x4, 6x6), edit, and delete.
 */
const EmbroideryServices = ({
  embroideryList = [],
  setEmbroideryList,
  setNotification
}) => {
  // Grid layout state
  const [selectedGrid, setSelectedGrid] = useState(DEFAULT_GRID_VIEW);

  // Modal dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_EMBROIDERY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // File input ref for system upload
  const fileInputRef = useRef(null);

  // Open modal in Add mode
  const handleOpenAdd = () => {
    setFormData(EMPTY_EMBROIDERY_FORM);
    setFormErrors({});
    setFormMode('add');
    setEditingOriginalId(null);
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEdit = (design) => {
    setFormData({
      id: design.id || '',
      name: design.name || '',
      description: design.description || '',
      imageUrl: design.imageUrl || '',
      cost: design.cost !== undefined ? String(design.cost) : ''
    });
    setFormErrors({});
    setFormMode('edit');
    setEditingOriginalId(design.id);
    setIsModalOpen(true);
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_EMBROIDERY_FORM);
    setFormErrors({});
    setEditingOriginalId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle standard input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle file uploads from the user's computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: 'Please select a valid image file (PNG, JPG, WEBP, etc.)'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: 'Image file size must be less than 5MB.'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setFormData((prev) => ({
        ...prev,
        imageUrl: dataUrl
      }));
      if (formErrors.imageUrl) {
        setFormErrors((prev) => ({ ...prev, imageUrl: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Clear chosen image
  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission (Add / Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateEmbroideryForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const formattedDesign = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      cost: Number(formData.cost)
    };

    if (formMode === 'edit') {
      if (formattedDesign.id !== editingOriginalId) {
        const conflict = embroideryList.some((item) => item.id === formattedDesign.id);
        if (conflict) {
          setFormErrors({ id: 'Another embroidery design with this ID already exists.' });
          return;
        }
      }

      setEmbroideryList((prev) =>
        prev.map((item) =>
          item.id === editingOriginalId ? formattedDesign : item
        )
      );

      if (setNotification) {
        setNotification({
          type: 'success',
          text: `Embroidery design "${formattedDesign.name}" updated successfully.`
        });
      }
    } else {
      const conflict = embroideryList.some((item) => item.id === formattedDesign.id);
      if (conflict) {
        setFormErrors({ id: 'An embroidery design with this ID already exists.' });
        return;
      }

      setEmbroideryList((prev) => [formattedDesign, ...prev]);

      if (setNotification) {
        setNotification({
          type: 'success',
          text: `Embroidery design "${formattedDesign.name}" added to collection.`
        });
      }
    }

    handleCloseModal();
  };

  // Delete embroidery design with confirmation
  const handleDeleteDesign = (designId, designName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete embroidery design "${designName}" (ID: ${designId})?`
    );
    if (!isConfirmed) return;

    setEmbroideryList((prev) => prev.filter((item) => item.id !== designId));

    if (setNotification) {
      setNotification({
        type: 'success',
        text: `Embroidery design "${designName}" was deleted.`
      });
    }
  };

  return (
    <section className="admin-products-section" aria-label="Embroidery Designs Management">
      {/* 1. Header Action Bar */}
      <div className="admin-products-header-bar">
        <div className="admin-products-title-group">
          <h2 className="admin-products-title">Embroidery Designs</h2>
          {embroideryList.length > 0 && (
            <span className="admin-products-count-badge">
              {embroideryList.length} {embroideryList.length === 1 ? 'Design' : 'Designs'}
            </span>
          )}
        </div>

        <div className="admin-products-actions-group">
          {/* Grid View Switcher Controls */}
          <div className="admin-grid-control" role="group" aria-label="Embroidery grid layout">
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

          {/* + Add Design Button */}
          <button
            type="button"
            className="admin-btn-wine admin-btn-add-product"
            onClick={handleOpenAdd}
          >
            <span>＋</span> Add Design
          </button>
        </div>
      </div>

      {/* 2. Content: Empty State / 1x1 Table View / 2x2, 4x4, 6x6 Card Grids */}
      {embroideryList.length === 0 ? (
        <div className="admin-products-empty-state">
          <div className="admin-products-empty-icon">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
          <h3 className="admin-products-empty-title">No Embroidery Designs Configured</h3>
          <p className="admin-products-empty-desc">
            There are currently no embroidery patterns or bridal blouse works in the showroom catalog. Click below to add your first design.
          </p>
          <button
            type="button"
            className="admin-btn-wine"
            onClick={handleOpenAdd}
          >
            <span>＋</span> Add Design
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
                  <th>ID</th>
                  <th>Name of Design</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {embroideryList.map((design) => (
                  <tr key={design.id}>
                    {/* Design Image Thumbnail */}
                    <td>
                      <div className="admin-table-img-cell" title={design.name}>
                        <img
                          src={design.imageUrl}
                          alt={design.name}
                          className="admin-table-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </td>

                    {/* ID */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="admin-product-id-badge">
                        {design.id}
                      </span>
                    </td>

                    {/* Name of Design */}
                    <td>
                      <strong className="admin-table-name">{design.name}</strong>
                    </td>

                    {/* Description */}
                    <td>
                      <div className="admin-table-desc" title={design.description || 'No description'}>
                        {design.description || '—'}
                      </div>
                    </td>

                    {/* Cost */}
                    <td>
                      <span className="admin-table-cost">
                        {formatIndianCurrency(design.cost)}
                      </span>
                    </td>

                    {/* Actions: Edit + Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="admin-product-edit-btn"
                          onClick={() => handleOpenEdit(design)}
                          aria-label={`Edit ${design.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-product-delete-btn"
                          onClick={() => handleDeleteDesign(design.id, design.name)}
                          aria-label={`Delete ${design.name}`}
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
          {embroideryList.map((design) => (
            <article key={design.id} className="admin-product-card">
              <div className="admin-product-img-container">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="admin-product-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('has-fallback');
                  }}
                />
                <div className="admin-product-img-fallback" aria-hidden="true">
                  <span>Embroidery</span>
                </div>
              </div>

              <div className="admin-product-body">
                <div className="admin-product-meta-row">
                  <span className="admin-product-id-badge" title={`Design ID: ${design.id}`}>
                    ID: {design.id}
                  </span>
                  <span className="admin-product-cost">
                    {formatIndianCurrency(design.cost)}
                  </span>
                </div>

                <h3 className="admin-product-name" title={design.name}>
                  {design.name}
                </h3>

                {design.description && (
                  <p className="admin-product-desc" title={design.description}>
                    {design.description}
                  </p>
                )}

                <div className="admin-product-footer">
                  <button
                    type="button"
                    className="admin-product-edit-btn"
                    onClick={() => handleOpenEdit(design)}
                    aria-label={`Edit ${design.name}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-product-delete-btn"
                    onClick={() => handleDeleteDesign(design.id, design.name)}
                    aria-label={`Delete ${design.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 3. Add / Edit Embroidery Design Modal */}
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
            aria-labelledby="embroidery-modal-title"
          >
            <div className="admin-modal-header">
              <h3 id="embroidery-modal-title" className="admin-modal-title">
                {formMode === 'edit' ? 'Edit Embroidery Design' : 'Add Embroidery Design'}
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
              {/* 1) ID */}
              <div className="admin-form-group">
                <label htmlFor="modal-embroidery-id" className="admin-form-label">
                  <span>
                    ID <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-embroidery-id"
                  name="id"
                  type="text"
                  className={`admin-form-input ${formErrors.id ? 'input-error' : ''}`}
                  placeholder="e.g. EMB-BL-001"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.id && (
                  <span className="admin-form-error-msg">{formErrors.id}</span>
                )}
              </div>

              {/* 2) Name of the design */}
              <div className="admin-form-group">
                <label htmlFor="modal-embroidery-name" className="admin-form-label">
                  <span>
                    Name of the Design <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-embroidery-name"
                  name="name"
                  type="text"
                  className={`admin-form-input ${formErrors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Peacock Zardosi Computer Embroidery"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.name && (
                  <span className="admin-form-error-msg">{formErrors.name}</span>
                )}
              </div>

              {/* 3) Description */}
              <div className="admin-form-group">
                <label htmlFor="modal-embroidery-desc" className="admin-form-label">
                  <span>Description</span>
                </label>
                <textarea
                  id="modal-embroidery-desc"
                  name="description"
                  rows="3"
                  className="admin-form-textarea"
                  placeholder="Enter embroidery stitch type, thread work, neck pattern, delivery turnaround..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* 4) Image URL (with file option to upload from system) */}
              <div className="admin-form-group">
                <label htmlFor="modal-embroidery-img" className="admin-form-label">
                  <span>
                    Image URL <span className="admin-form-label-required">*</span>
                  </span>
                </label>

                <div className="admin-image-input-container">
                  <input
                    id="modal-embroidery-img"
                    name="imageUrl"
                    type="text"
                    className={`admin-form-input ${formErrors.imageUrl ? 'input-error' : ''}`}
                    placeholder="Paste image URL or upload from system"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                  />

                  <label className="admin-upload-btn-label" title="Upload image file from computer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="admin-hidden-file-input"
                      onChange={handleFileUpload}
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

                {formData.imageUrl && (
                  <div className="admin-image-preview-chip">
                    <img
                      src={formData.imageUrl}
                      alt="Embroidery design preview"
                      className="admin-image-preview-thumb"
                    />
                    <span className="admin-image-preview-text">
                      {formData.imageUrl.startsWith('data:') ? 'Uploaded from system' : formData.imageUrl}
                    </span>
                    <button
                      type="button"
                      className="admin-image-remove-btn"
                      onClick={handleClearImage}
                      title="Remove image"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {formErrors.imageUrl && (
                  <span className="admin-form-error-msg">{formErrors.imageUrl}</span>
                )}
              </div>

              {/* 5) Cost */}
              <div className="admin-form-group">
                <label htmlFor="modal-embroidery-cost" className="admin-form-label">
                  <span>
                    Cost (₹) <span className="admin-form-label-required">*</span>
                  </span>
                </label>
                <input
                  id="modal-embroidery-cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="1"
                  className={`admin-form-input ${formErrors.cost ? 'input-error' : ''}`}
                  placeholder="e.g. 2500"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.cost && (
                  <span className="admin-form-error-msg">{formErrors.cost}</span>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-wine">
                  {formMode === 'edit' ? 'Update Design' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmbroideryServices;
