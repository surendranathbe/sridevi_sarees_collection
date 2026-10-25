/**
 * Sridevi Sarees & Collections - Website Changes & CMS Panel
 * File: src/admindashboard/websitechanges.jsx
 *
 * Production-ready CMS module enabling administrators to manage, live-preview,
 * draft, and publish storefront changes across website sections, with primary
 * support for the Home Page Banner.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './websitechanges.css';
import {
  WEBSITE_SECTIONS,
  BANNER_RECOMMENDED_SPECS,
  DEFAULT_BANNER_CONFIG,
  validateBannerForm,
  validateBannerImageFile,
  getPublishedBanner,
  getDraftBanner,
  saveDraftBanner,
  publishBanner,
  resetBannerDefaults
} from '../data/bannerContent';

// Preset saree imagery available within the project for one-click selection
const PRESET_BANNER_IMAGES = [
  { label: 'Silk Sarees Heritage', path: 'src/assets/silk-sarees-banner1.png' },
  { label: 'Pattu Bridal Weaves', path: 'src/assets/pattu-saree-banner1.png' },
  { label: 'Cotton Everyday Breezy', path: 'src/assets/cotton-sarees-banner1.png' },
  { label: 'Designer Glamour Drapes', path: 'src/assets/desginer_sarees-banner1.png' },
  { label: 'Printed Art Motifs', path: 'src/assets/priented-sarees-banner1.jpg' },
  { label: 'Authentic Handloom', path: 'src/assets/handloom-sarees-banner1.jpg' }
];

export default function WebsiteChanges({ setNotification = () => {} }) {
  // Active selected section (Default: 'hero-banner')
  const [activeSectionId, setActiveSectionId] = useState('hero-banner');

  // Form state for Banner editing
  const [formData, setFormData] = useState(getDraftBanner);
  const [publishedVersion, setPublishedVersion] = useState(getPublishedBanner);
  const [formErrors, setFormErrors] = useState({});
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  // Modal confirmation states: null | 'publish' | 'cancel' | 'restore' | 'removeImage'
  const [confirmModal, setConfirmModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload input references
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  // Compute if current editing state has unsaved differences from published version
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(publishedVersion);
  }, [formData, publishedVersion]);

  // Warn user before accidental page reload or navigation when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Sync draft and published data on initial load
  useEffect(() => {
    const pub = getPublishedBanner();
    const draft = getDraftBanner();
    setPublishedVersion(pub);
    setFormData(draft);
  }, []);

  // Form field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear field-specific validation error on user edit
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Image file upload handler with validation
  const handleFileUpload = (e, targetField = 'desktopImage') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validation = validateBannerImageFile(file);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        message: validation.error || 'Failed to upload image.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleFieldChange(targetField, reader.result);
      setNotification({
        type: 'success',
        message: `Image "${file.name}" loaded successfully into preview.`
      });
    };
    reader.onerror = () => {
      setNotification({
        type: 'error',
        message: 'Could not read image file. Please try another image.'
      });
    };
    reader.readAsDataURL(file);

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  // Save current editing state as a draft
  const handleSaveDraft = () => {
    const validation = validateBannerForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setNotification({
        type: 'error',
        message: 'Please resolve form validation errors before saving draft.'
      });
      return;
    }

    const ok = saveDraftBanner(formData);
    if (ok) {
      setNotification({
        type: 'success',
        message: 'Draft saved successfully. Customer storefront remains unchanged until published.'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Unable to save draft into storage.'
      });
    }
  };

  // Execute publication to live storefront
  const handleExecutePublish = () => {
    const validation = validateBannerForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setConfirmModal(null);
      setNotification({
        type: 'error',
        message: 'Cannot publish: Please fill in all required banner fields.'
      });
      return;
    }

    setIsSubmitting(true);
    const success = publishBanner(formData);
    setIsSubmitting(false);
    setConfirmModal(null);

    if (success) {
      setPublishedVersion(formData);
      setNotification({
        type: 'success',
        message: '🎉 Banner changes published! Storefront has been updated in real-time.'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to publish banner changes.'
      });
    }
  };

  // Discard unsaved changes and restore to last saved published version
  const handleExecuteCancel = () => {
    const pub = getPublishedBanner();
    setFormData(pub);
    setFormErrors({});
    setConfirmModal(null);
    setNotification({
      type: 'info',
      message: 'Unsaved edits discarded. Restored last published configuration.'
    });
  };

  // Restore factory original default banner configuration
  const handleExecuteRestoreDefault = () => {
    const ok = resetBannerDefaults();
    setConfirmModal(null);
    if (ok) {
      setFormData(DEFAULT_BANNER_CONFIG);
      setPublishedVersion(DEFAULT_BANNER_CONFIG);
      setFormErrors({});
      setNotification({
        type: 'success',
        message: 'Restored original Sridevi Sarees factory banner configuration.'
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to reset banner defaults.'
      });
    }
  };

  // Remove image from banner
  const handleExecuteRemoveImage = () => {
    handleFieldChange('desktopImage', '');
    setConfirmModal(null);
    setNotification({
      type: 'info',
      message: 'Desktop banner image removed. Please select or upload a replacement image.'
    });
  };

  const activeSection = WEBSITE_SECTIONS.find((s) => s.id === activeSectionId) || WEBSITE_SECTIONS[0];

  return (
    <div className="website-changes-panel">
      {/* =========================================================
          1. HEADER SHOWCASE CARD
          ========================================================= */}
      <div className="wc-header-card">
        <div className="wc-header-info">
          <span className="wc-badge-gold">
            <span>✨</span> Storefront Content Management (CMS)
          </span>
          <h1 className="wc-header-title">Website Content & Banner Studio</h1>
          <p className="wc-header-subtitle">
            Manage your customer-facing promotional headlines, banners, buttons, and sections.
            Preview updates live on desktop and mobile viewports before publishing to the showroom store.
          </p>
        </div>

        <div className="wc-header-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="wc-btn wc-btn-secondary"
            title="Open customer storefront in a new tab"
          >
            <span>↗</span> View Live Storefront
          </a>
        </div>
      </div>

      {/* =========================================================
          2. SECTION SELECTOR (10 SECTIONS)
          ========================================================= */}
      <div className="wc-sections-container">
        <div className="wc-sections-header">
          <div className="wc-sections-header-title">
            <span>🗂️</span>
            <span>Select Website Section to Edit</span>
          </div>
          <span className="wc-sections-count">10 Available Sections</span>
        </div>

        <div className="wc-section-tabs-grid">
          {WEBSITE_SECTIONS.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                type="button"
                className={`wc-section-card ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (isDirty && section.id !== activeSectionId) {
                    if (window.confirm('You have unsaved banner edits. Switch section anyway?')) {
                      setActiveSectionId(section.id);
                    }
                  } else {
                    setActiveSectionId(section.id);
                  }
                }}
              >
                <div className="wc-section-top-row">
                  <span className="wc-section-icon">{section.icon}</span>
                  <span
                    className={`wc-section-badge ${
                      section.isImplemented ? 'is-implemented' : 'is-coming-soon'
                    }`}
                  >
                    {section.badge}
                  </span>
                </div>
                <h3 className="wc-section-card-title">{section.title}</h3>
                <p className="wc-section-card-desc">{section.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          3. MAIN CONTENT: HERO BANNER vs COMING SOON STATES
          ========================================================= */}
      {activeSection.isImplemented ? (
        <>
          {/* Top Action Bar */}
          <div className="wc-action-bar">
            <div className="wc-action-left">
              <span className={`wc-status-pill ${isDirty ? 'is-draft' : 'is-published'}`}>
                <span>{isDirty ? '●' : '✓'}</span>
                {isDirty ? 'Unpublished Changes in Workspace' : 'All Changes Published & Live'}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#8c7a82' }}>
                Target: <strong>Home Page Hero Banner</strong>
              </span>
            </div>

            <div className="wc-action-right">
              <button
                type="button"
                className="wc-btn wc-btn-secondary"
                onClick={() => setConfirmModal('restore')}
                title="Restore default Sridevi Sarees branding"
              >
                <span>↺</span> Restore Defaults
              </button>
              <button
                type="button"
                className="wc-btn wc-btn-secondary"
                onClick={handleSaveDraft}
                title="Save current state as a draft without publishing"
              >
                <span>💾</span> Save Draft
              </button>
              {isDirty && (
                <button
                  type="button"
                  className="wc-btn wc-btn-outline-danger"
                  onClick={() => setConfirmModal('cancel')}
                  title="Discard unsaved edits"
                >
                  <span>✕</span> Discard Edits
                </button>
              )}
              <button
                type="button"
                className="wc-btn wc-btn-publish"
                onClick={() => setConfirmModal('publish')}
                disabled={isSubmitting}
                title="Publish changes to the customer-facing website"
              >
                <span>🚀</span> {isSubmitting ? 'Publishing...' : 'Publish to Storefront'}
              </button>
            </div>
          </div>

          {/* 2-Column Workspace: Left Editor, Right Live Preview */}
          <div className="wc-workspace-layout">
            {/* =========================================
                COLUMN A: BANNER EDITOR FORM
                ========================================= */}
            <div className="wc-editor-card">
              <div className="wc-editor-header">
                <div className="wc-editor-title-wrap">
                  <span>🎨</span>
                  <h2 className="wc-editor-title">Home Page Banner Settings</h2>
                </div>
                <span className="wc-label-hint">All fields update preview in real-time</span>
              </div>

              <div className="wc-editor-body">
                {/* 1. Visibility Toggle */}
                <div className="wc-toggle-group">
                  <div className="wc-toggle-info">
                    <span className="wc-toggle-title">Showcase Banner Visibility</span>
                    <span className="wc-toggle-desc">
                      Toggle whether the hero showcase is visible or hidden on the storefront home page.
                    </span>
                  </div>
                  <label className="wc-toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => handleFieldChange('isVisible', e.target.checked)}
                    />
                    <span className="wc-toggle-slider" />
                  </label>
                </div>

                {/* 2. Headline & Content */}
                <div className="wc-field-section">
                  <div className="wc-field-section-legend">
                    <span>✍️</span> Main Headlines & Copy
                  </div>

                  <div className="wc-form-row">
                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-title">
                        <span>Main Headline Title <span className="wc-label-req">*</span></span>
                        <span className="wc-label-hint">Max 60 chars</span>
                      </label>
                      <input
                        id="banner-title"
                        type="text"
                        className={`wc-input ${formErrors.title ? 'has-error' : ''}`}
                        placeholder="e.g. Silk Sarees"
                        value={formData.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                      />
                      {formErrors.title && <span className="wc-field-error">{formErrors.title}</span>}
                    </div>

                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-tag">
                        <span>Eyebrow Promotional Tag</span>
                        <span className="wc-label-hint">Gold Top Badge</span>
                      </label>
                      <input
                        id="banner-tag"
                        type="text"
                        className="wc-input"
                        placeholder="e.g. PREMIUM COLLECTION"
                        value={formData.tag}
                        onChange={(e) => handleFieldChange('tag', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>

                  <div className="wc-form-group">
                    <label className="wc-label" htmlFor="banner-subheadline">
                      <span>Subheadline <span className="wc-label-req">*</span></span>
                      <span className="wc-label-hint">Key highlights</span>
                    </label>
                    <input
                      id="banner-subheadline"
                      type="text"
                      className={`wc-input ${formErrors.subheadline ? 'has-error' : ''}`}
                      placeholder="e.g. Pure Kanchipuram, Banarasi & Dola Silk"
                      value={formData.subheadline}
                      onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                    />
                    {formErrors.subheadline && (
                      <span className="wc-field-error">{formErrors.subheadline}</span>
                    )}
                  </div>

                  <div className="wc-form-group">
                    <label className="wc-label" htmlFor="banner-subtitle">
                      <span>Secondary Subtitle Tagline</span>
                      <span className="wc-label-hint">Fabric variety pill</span>
                    </label>
                    <input
                      id="banner-subtitle"
                      type="text"
                      className="wc-input"
                      placeholder="e.g. Dola Silk • Kanchipuram • Banarasi • Pure Silk"
                      value={formData.subtitle || ''}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    />
                  </div>

                  <div className="wc-form-group">
                    <label className="wc-label" htmlFor="banner-desc">
                      <span>Description Text <span className="wc-label-req">*</span></span>
                      <span className="wc-label-hint">Heritage weaving story</span>
                    </label>
                    <textarea
                      id="banner-desc"
                      rows={3}
                      className={`wc-textarea ${formErrors.description ? 'has-error' : ''}`}
                      placeholder="Describe the collection's texture, craftsmanship, and occasion appeal..."
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                    {formErrors.description && (
                      <span className="wc-field-error">{formErrors.description}</span>
                    )}
                  </div>
                </div>

                {/* 3. Banner Image Management */}
                <div className="wc-field-section">
                  <div className="wc-field-section-legend">
                    <span>📸</span> Banner Image Management
                  </div>

                  {/* Dimension Guide Alert */}
                  <div style={{
                    background: '#f9f5f0',
                    border: '1px solid #e5d9ce',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.78rem',
                    color: '#6e5a63',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>📐</span>
                    <div>
                      <strong>Recommended Dimensions:</strong> Desktop: 1920 × 850px (or 16:9 widescreen) |
                      Mobile: 800 × 1000px | Max size: {BANNER_RECOMMENDED_SPECS.maxFileSizeMB}MB (JPG, PNG, WebP).
                    </div>
                  </div>

                  {/* Dropzone for File Upload */}
                  <div
                    className="wc-upload-dropzone"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="wc-dropzone-icon">📤</span>
                    <p className="wc-dropzone-title">Click to Upload New Banner from Computer</p>
                    <p className="wc-dropzone-specs">Supports JPG, PNG, and WebP (Up to 4MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, 'desktopImage')}
                    />
                  </div>

                  {/* Preset Library Quick Selector */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <label className="wc-label">
                      <span>Or Choose from Existing Storefront Presets:</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      {PRESET_BANNER_IMAGES.map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          className="wc-btn-xs"
                          style={{
                            background: formData.desktopImage === preset.path ? '#580c29' : '#f0e6de',
                            color: formData.desktopImage === preset.path ? '#fff' : '#452b35',
                            border: '1px solid #d8c9bd'
                          }}
                          onClick={() => handleFieldChange('desktopImage', preset.path)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image URL Input Alternative */}
                  <div className="wc-form-group" style={{ marginTop: '0.85rem' }}>
                    <label className="wc-label" htmlFor="banner-image-url">
                      <span>Direct Image URL / Asset Path <span className="wc-label-req">*</span></span>
                    </label>
                    <input
                      id="banner-image-url"
                      type="text"
                      className={`wc-input ${formErrors.desktopImage ? 'has-error' : ''}`}
                      placeholder="e.g. src/assets/silk-sarees-banner1.png or https://..."
                      value={formData.desktopImage}
                      onChange={(e) => handleFieldChange('desktopImage', e.target.value)}
                    />
                    {formErrors.desktopImage && (
                      <span className="wc-field-error">{formErrors.desktopImage}</span>
                    )}
                  </div>

                  {/* Current Image Mini Preview */}
                  {formData.desktopImage && (
                    <div className="wc-current-image-preview">
                      <img
                        src={formData.desktopImage}
                        alt={formData.imageAlt || 'Selected banner image'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="wc-image-preview-overlay">
                        <span>Current Selected Banner</span>
                        <div className="wc-image-btn-strip">
                          <button
                            type="button"
                            className="wc-btn-xs"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            className="wc-btn-xs is-danger"
                            onClick={() => setConfirmModal('removeImage')}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="wc-form-group" style={{ marginTop: '0.85rem' }}>
                    <label className="wc-label" htmlFor="banner-image-alt">
                      <span>Accessibility Image Alt Text</span>
                      <span className="wc-label-hint">For Screen Readers & SEO</span>
                    </label>
                    <input
                      id="banner-image-alt"
                      type="text"
                      className="wc-input"
                      placeholder="Describe the image content..."
                      value={formData.imageAlt || ''}
                      onChange={(e) => handleFieldChange('imageAlt', e.target.value)}
                    />
                  </div>
                </div>

                {/* 4. Call to Action Buttons */}
                <div className="wc-field-section">
                  <div className="wc-field-section-legend">
                    <span>🔘</span> Call to Action Buttons
                  </div>

                  <div className="wc-form-row">
                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-btn1-text">
                        <span>Primary Button Text <span className="wc-label-req">*</span></span>
                      </label>
                      <input
                        id="banner-btn1-text"
                        type="text"
                        className={`wc-input ${formErrors.primaryButtonText ? 'has-error' : ''}`}
                        placeholder="e.g. EXPLORE COLLECTION"
                        value={formData.primaryButtonText}
                        onChange={(e) => handleFieldChange('primaryButtonText', e.target.value)}
                      />
                      {formErrors.primaryButtonText && (
                        <span className="wc-field-error">{formErrors.primaryButtonText}</span>
                      )}
                    </div>

                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-btn1-url">
                        <span>Primary Button Destination <span className="wc-label-req">*</span></span>
                      </label>
                      <input
                        id="banner-btn1-url"
                        type="text"
                        className={`wc-input ${formErrors.primaryButtonUrl ? 'has-error' : ''}`}
                        placeholder="e.g. #collection-anchor or /collections"
                        value={formData.primaryButtonUrl}
                        onChange={(e) => handleFieldChange('primaryButtonUrl', e.target.value)}
                      />
                      {formErrors.primaryButtonUrl && (
                        <span className="wc-field-error">{formErrors.primaryButtonUrl}</span>
                      )}
                    </div>
                  </div>

                  <div className="wc-form-row">
                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-btn2-text">
                        <span>Secondary Button Text (Optional)</span>
                      </label>
                      <input
                        id="banner-btn2-text"
                        type="text"
                        className="wc-input"
                        placeholder="e.g. View All Sarees"
                        value={formData.secondaryButtonText || ''}
                        onChange={(e) => handleFieldChange('secondaryButtonText', e.target.value)}
                      />
                    </div>

                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-btn2-url">
                        <span>Secondary Button Destination</span>
                      </label>
                      <input
                        id="banner-btn2-url"
                        type="text"
                        className="wc-input"
                        placeholder="e.g. #view-all"
                        value={formData.secondaryButtonUrl || ''}
                        onChange={(e) => handleFieldChange('secondaryButtonUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Styling, Alignment & Overlay */}
                <div className="wc-field-section">
                  <div className="wc-field-section-legend">
                    <span>🎨</span> Styling, Alignment & Dimming Overlay
                  </div>

                  <div className="wc-form-row">
                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-text-align">
                        <span>Text Alignment</span>
                      </label>
                      <select
                        id="banner-text-align"
                        className="wc-select"
                        value={formData.textAlign}
                        onChange={(e) => handleFieldChange('textAlign', e.target.value)}
                      >
                        <option value="left">Left Aligned (Classic Storefront)</option>
                        <option value="center">Centered (Formal Festive Hero)</option>
                        <option value="right">Right Aligned (Modern Fashion)</option>
                      </select>
                    </div>

                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-color-theme">
                        <span>Text Color Palette</span>
                      </label>
                      <select
                        id="banner-color-theme"
                        className="wc-select"
                        value={formData.textColorTheme}
                        onChange={(e) => handleFieldChange('textColorTheme', e.target.value)}
                      >
                        <option value="gold-ivory">Royal Gold & Ivory (Default)</option>
                        <option value="pure-white">Pure White Elegance</option>
                        <option value="royal-crimson">Deep Crimson & Gold</option>
                      </select>
                    </div>
                  </div>

                  <div className="wc-form-row">
                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-overlay-color">
                        <span>Overlay Dim Tint</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          id="banner-overlay-color"
                          type="color"
                          style={{
                            width: '42px',
                            height: '38px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          value={formData.overlayColor}
                          onChange={(e) => handleFieldChange('overlayColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="wc-input"
                          value={formData.overlayColor}
                          onChange={(e) => handleFieldChange('overlayColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="wc-form-group">
                      <label className="wc-label" htmlFor="banner-overlay-opacity">
                        <span>Overlay Opacity ({Math.round(formData.overlayOpacity * 100)}%)</span>
                        <span className="wc-label-hint">For text contrast</span>
                      </label>
                      <input
                        id="banner-overlay-opacity"
                        type="range"
                        min="0"
                        max="0.85"
                        step="0.05"
                        value={formData.overlayOpacity}
                        onChange={(e) =>
                          handleFieldChange('overlayOpacity', parseFloat(e.target.value))
                        }
                        style={{ marginTop: '0.4rem', accentColor: '#580c29' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================
                COLUMN B: RESPONSIVE LIVE PREVIEW PANEL
                ========================================= */}
            <div className="wc-preview-card">
              <div className="wc-preview-header">
                <div className="wc-preview-title">
                  <span>👁️</span>
                  <span>Interactive Live Preview</span>
                </div>

                <div className="wc-device-toggle">
                  <button
                    type="button"
                    className={`wc-device-btn ${previewDevice === 'desktop' ? 'is-active' : ''}`}
                    onClick={() => setPreviewDevice('desktop')}
                    title="Switch to Desktop 16:9 view"
                  >
                    <span>💻</span> Desktop
                  </button>
                  <button
                    type="button"
                    className={`wc-device-btn ${previewDevice === 'mobile' ? 'is-active' : ''}`}
                    onClick={() => setPreviewDevice('mobile')}
                    title="Switch to Mobile portrait view"
                  >
                    <span>📱</span> Mobile
                  </button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="wc-preview-viewport-wrap">
                <div
                  className={
                    previewDevice === 'desktop' ? 'wc-viewport-desktop' : 'wc-viewport-mobile'
                  }
                >
                  {/* Simulated Storefront Banner */}
                  <div
                    className="wc-sim-banner"
                    style={{
                      backgroundImage: formData.desktopImage ? `url("${formData.desktopImage}")` : 'none',
                      backgroundColor: '#200511',
                      textAlign: formData.textAlign,
                      alignItems: formData.textAlign === 'center' ? 'center' : 'flex-start'
                    }}
                  >
                    {/* Dim Overlay */}
                    <div
                      className="wc-sim-overlay"
                      style={{
                        backgroundColor: formData.overlayColor,
                        opacity: formData.overlayOpacity
                      }}
                    />

                    {/* Content Group */}
                    <div
                      className="wc-sim-content"
                      style={{
                        alignItems:
                          formData.textAlign === 'center'
                            ? 'center'
                            : formData.textAlign === 'right'
                            ? 'flex-end'
                            : 'flex-start'
                      }}
                    >
                      {/* Eyebrow Tag */}
                      {formData.tag && (
                        <div className="wc-sim-tag-wrap">
                          <span className="wc-sim-accent-line" />
                          <span className="wc-sim-tag">{formData.tag}</span>
                          <span className="wc-sim-accent-line" />
                        </div>
                      )}

                      {/* Main Title */}
                      <h2
                        className="wc-sim-title"
                        style={{
                          color:
                            formData.textColorTheme === 'pure-white'
                              ? '#ffffff'
                              : formData.textColorTheme === 'royal-crimson'
                              ? '#ffccd5'
                              : '#fcf6e8'
                        }}
                      >
                        {formData.title || 'Untitled Banner'}
                      </h2>

                      {/* Subheadline */}
                      {formData.subheadline && (
                        <p className="wc-sim-subheadline">{formData.subheadline}</p>
                      )}

                      {/* Description */}
                      {formData.description && (
                        <p className="wc-sim-desc">{formData.description}</p>
                      )}

                      {/* CTAs */}
                      <div
                        className="wc-sim-actions"
                        style={{
                          justifyContent:
                            formData.textAlign === 'center'
                              ? 'center'
                              : formData.textAlign === 'right'
                              ? 'flex-end'
                              : 'flex-start'
                        }}
                      >
                        {formData.primaryButtonText && (
                          <div className="wc-sim-btn-primary">
                            <span>{formData.primaryButtonText}</span>
                            <span>&rarr;</span>
                          </div>
                        )}
                        {formData.secondaryButtonText && (
                          <div className="wc-sim-btn-secondary">
                            <span>{formData.secondaryButtonText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Footer Notice */}
              <div className="wc-preview-footer-notice">
                <span>
                  {isDirty ? (
                    <strong style={{ color: '#d97706' }}>● Preview shows unpublished draft</strong>
                  ) : (
                    <strong style={{ color: '#16a34a' }}>✓ Preview matches live storefront</strong>
                  )}
                </span>
                <a href="/" target="_blank" rel="noopener noreferrer" className="wc-preview-footer-link">
                  Open Storefront ↗
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================
            4. COMING SOON STATE FOR UNIMPLEMENTED SECTIONS
            ========================================================= */
        <div className="wc-coming-soon-card">
          <div className="wc-coming-soon-icon">{activeSection.icon}</div>
          <h2 className="wc-coming-soon-title">{activeSection.title} Management</h2>
          <p className="wc-coming-soon-desc">
            The editing interface for <strong>{activeSection.title}</strong> is scheduled for the upcoming
            release. It will allow you to customize content, layout, badges, and operational details directly
            from this console.
          </p>

          <div className="wc-coming-soon-roadmap">
            <span className="wc-roadmap-chip">Planned in Sprint 2</span>
            <span className="wc-roadmap-chip">Modular CMS Compatible</span>
            <span className="wc-roadmap-chip">Role-Based Publishing</span>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="wc-btn wc-btn-primary"
              onClick={() => setActiveSectionId('hero-banner')}
            >
              <span>✨</span> Return to Home Page Banner Editor
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          5. CONFIRMATION MODALS
          ========================================================= */}
      {confirmModal && (
        <div className="wc-modal-backdrop" onClick={() => setConfirmModal(null)}>
          <div className="wc-modal-box" onClick={(e) => e.stopPropagation()}>
            {confirmModal === 'publish' && (
              <>
                <h3 className="wc-modal-title">
                  <span>🚀</span> Publish Banner to Customer Storefront?
                </h3>
                <p className="wc-modal-desc">
                  This will immediately update the Home Page Banner on the customer-facing website with your
                  new headlines, imagery, and button destinations.
                </p>
                <div className="wc-modal-actions">
                  <button
                    type="button"
                    className="wc-btn wc-btn-secondary"
                    onClick={() => setConfirmModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="wc-btn wc-btn-publish"
                    onClick={handleExecutePublish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Yes, Publish Changes'}
                  </button>
                </div>
              </>
            )}

            {confirmModal === 'cancel' && (
              <>
                <h3 className="wc-modal-title">
                  <span>⚠️</span> Discard Unsaved Changes?
                </h3>
                <p className="wc-modal-desc">
                  Are you sure you want to discard your edits? All changes made in this editing session will
                  be reverted to the currently published banner.
                </p>
                <div className="wc-modal-actions">
                  <button
                    type="button"
                    className="wc-btn wc-btn-secondary"
                    onClick={() => setConfirmModal(null)}
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    className="wc-btn wc-btn-outline-danger"
                    onClick={handleExecuteCancel}
                  >
                    Discard Changes
                  </button>
                </div>
              </>
            )}

            {confirmModal === 'restore' && (
              <>
                <h3 className="wc-modal-title">
                  <span>↺</span> Restore Factory Original Banner?
                </h3>
                <p className="wc-modal-desc">
                  This will reset all banner headings, descriptions, tags, and images back to the default
                  Sridevi Sarees pure silk collection configuration.
                </p>
                <div className="wc-modal-actions">
                  <button
                    type="button"
                    className="wc-btn wc-btn-secondary"
                    onClick={() => setConfirmModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="wc-btn wc-btn-outline-danger"
                    onClick={handleExecuteRestoreDefault}
                  >
                    Yes, Restore Defaults
                  </button>
                </div>
              </>
            )}

            {confirmModal === 'removeImage' && (
              <>
                <h3 className="wc-modal-title">
                  <span>🗑️</span> Remove Banner Image?
                </h3>
                <p className="wc-modal-desc">
                  This will remove the current banner image from the editor. You will need to select or
                  upload a new image before publishing.
                </p>
                <div className="wc-modal-actions">
                  <button
                    type="button"
                    className="wc-btn wc-btn-secondary"
                    onClick={() => setConfirmModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="wc-btn wc-btn-outline-danger"
                    onClick={handleExecuteRemoveImage}
                  >
                    Remove Image
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
