import React, { useState, useRef } from 'react';
import {
  PRODUCT_GRID_CONFIGS,
  DEFAULT_GRID_VIEW,
  EMPTY_EMBROIDERY_FORM,
  validateEmbroideryForm,
  formatIndianCurrency
} from '../data/products';
import { apiFetch, uploadImageFile } from '../utils/api';

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

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file uploads directly to backend /api/admin/uploads
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImageFile(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: url
      }));
      if (formErrors.imageUrl) {
        setFormErrors((prev) => ({ ...prev, imageUrl: undefined }));
      }
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: err.message || 'Image upload failed.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Clear chosen image
  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission (Add / Update via backend API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEmbroideryForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const payload = {
      serviceId: formData.id.trim(),
      designName: formData.name.trim(),
      category: 'Blouse Embroidery',
      cost: Number(formData.cost),
      leadTime: '3-5 Days',
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim()
    };

    setIsSubmitting(true);
    try {
      const isEdit = formMode === 'edit';
      const endpoint = isEdit
        ? `/api/admin/embroidery-services/${encodeURIComponent(editingOriginalId)}`
        : '/api/admin/embroidery-services';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        if (result.errors && typeof result.errors === 'object') {
          const mappedErrors = {};
          if (result.errors.serviceId) mappedErrors.id = result.errors.serviceId;
          if (result.errors.designName) mappedErrors.name = result.errors.designName;
          if (result.errors.imageUrl) mappedErrors.imageUrl = result.errors.imageUrl;
          if (result.errors.cost) mappedErrors.cost = result.errors.cost;
          if (result.errors.description) mappedErrors.description = result.errors.description;
          setFormErrors({ ...result.errors, ...mappedErrors });
        } else {
          setFormErrors({ general: result.message || 'Failed to save embroidery design.' });
        }
        return;
      }

      const saved = result.data;
      const normalizedDesign = {
        id: saved?.serviceId || payload.serviceId,
        name: saved?.designName || payload.designName,
        description: saved?.description || payload.description,
        imageUrl: saved?.imageUrl || payload.imageUrl,
        cost: saved?.cost !== undefined ? saved.cost : payload.cost,
        ...saved
      };

      if (isEdit) {
        setEmbroideryList((prev) =>
          prev.map((item) =>
            item.id === editingOriginalId ? normalizedDesign : item
          )
        );

        if (setNotification) {
          setNotification({
            type: 'success',
            text: `Embroidery design "${normalizedDesign.name}" updated successfully.`
          });
        }
      } else {
        setEmbroideryList((prev) => [normalizedDesign, ...prev]);

        if (setNotification) {
          setNotification({
            type: 'success',
            text: `Embroidery design "${normalizedDesign.name}" added to collection.`
          });
        }
      }

      handleCloseModal();
    } catch (err) {
      setFormErrors({ general: err.message || 'An unexpected error occurred while saving embroidery design.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete embroidery design with confirmation via backend API
  const handleDeleteDesign = async (designId, designName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete embroidery design "${designName}" (ID: ${designId})?`
    );
    if (!isConfirmed) return;

    try {
      const response = await apiFetch(`/api/admin/embroidery-services/${encodeURIComponent(designId)}`, {
        method: 'DELETE'
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        if (setNotification) {
          setNotification({
            type: 'error',
            text: result.message || `Failed to delete design "${designName}".`
          });
        }
        return;
      }

      setEmbroideryList((prev) => prev.filter((item) => item.id !== designId));

      if (setNotification) {
        setNotification({
          type: 'success',
          text: `Embroidery design "${designName}" was deleted.`
        });
      }
    } catch (err) {
      if (setNotification) {
        setNotification({
          type: 'error',
          text: err.message || `Failed to delete design "${designName}".`
        });
      }
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
              {formErrors.general && (
                <div className="admin-form-error-banner" style={{ padding: '0.65rem', marginBottom: '0.9rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem' }}>
                  {formErrors.general}
                </div>
              )}
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
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="admin-hidden-file-input"
                      onChange={handleFileUpload}
                    />
                    <span className="admin-upload-btn">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {isUploading ? 'Uploading...' : 'Upload'}
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
                <button type="submit" className="admin-btn-wine" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : formMode === 'edit' ? 'Update Design' : 'Submit'}
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
