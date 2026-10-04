import React, { useState } from 'react';
import './admin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    securityPin: '',
    rememberDevice: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    // Standalone demonstration logic - no page redirection
    setTimeout(() => {
      setIsSubmitting(false);
      if (formData.emailOrUsername && formData.password) {
        setStatusMessage({
          type: 'success',
          text: `Authentication verified for "${formData.emailOrUsername}". (Standalone Admin Login Component)`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Please provide both valid administrator credentials.'
        });
      }
    }, 600);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Header Branding */}
        <div className="admin-login-header">
          <div className="admin-login-brand-tag">
            <span>⚜</span> Authorized Personnel Only
          </div>
          <h1 className="admin-login-title">Sridevi Sarees</h1>
          <p className="admin-login-subtitle">
            Admin Management Portal & Inventory Control
          </p>
        </div>

        {/* Feedback Banner */}
        {statusMessage && (
          <div
            className={`admin-alert-banner ${statusMessage.type}`}
            style={{ marginBottom: '1.25rem' }}
            role="alert"
          >
            <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form className="admin-login-form" onSubmit={handleLoginSubmit} noValidate>
          {/* Email / Username Field */}
          <div className="admin-form-group">
            <label htmlFor="admin-email-username" className="admin-form-label">
              <span>
                Admin Email / Username
                <span className="admin-form-label-required">*</span>
              </span>
              <span className="admin-form-label-hint">e.g. admin@sridevisarees.com</span>
            </label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">👤</span>
              <input
                id="admin-email-username"
                name="emailOrUsername"
                type="text"
                className="admin-form-input admin-input-with-icon"
                placeholder="Enter administrator username or email"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label">
              <span>
                Master Password
                <span className="admin-form-label-required">*</span>
              </span>
              <span className="admin-form-label-hint">Confidential</span>
            </label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🔒</span>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="admin-form-input admin-input-with-icon admin-input-with-toggle"
                placeholder="Enter administrative password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Security PIN Field */}
          <div className="admin-form-group">
            <label htmlFor="admin-security-pin" className="admin-form-label">
              <span>Security Access PIN</span>
              <span className="admin-form-label-hint">Optional 6-digit key</span>
            </label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🛡️</span>
              <input
                id="admin-security-pin"
                name="securityPin"
                type="password"
                maxLength={6}
                className="admin-form-input admin-input-with-icon"
                placeholder="######"
                value={formData.securityPin}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Remember Device & Recovery Links */}
          <div className="admin-checkbox-group">
            <label htmlFor="admin-remember-device" className="admin-checkbox-label">
              <input
                id="admin-remember-device"
                name="rememberDevice"
                type="checkbox"
                className="admin-checkbox-input"
                checked={formData.rememberDevice}
                onChange={handleInputChange}
              />
              <span>Remember this trusted device</span>
            </label>

            <button
              type="button"
              className="admin-forgot-link"
              style={{ background: 'none', border: 'none', padding: 0 }}
              onClick={() =>
                setStatusMessage({
                  type: 'error',
                  text: 'To reset admin access, please contact the primary store administrator.'
                })
              }
            >
              Need access help?
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="admin-login-submit-btn"
            type="submit"
            className="admin-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Console'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="admin-login-footer">
          <p>© {new Date().getFullYear()} Sridevi Sarees & Collections, Kandukur.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Store Location: Kovur Road, Near Sai Baba Temple
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
