import React, { useState } from 'react';
import logoImg from '../assets/logo_2.png';
import './admin.css';

const AdminLogin = ({ onLoginSuccess, onNavigate, authError }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(() => (
    authError ? { type: 'error', text: authError } : null
  ));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const goToDashboard = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else if (onNavigate) {
      onNavigate('admin-dashboard');
    } else {
      window.location.href = '/admindashboard';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const emailTrimmed = formData.email ? formData.email.trim() : '';
    const password = formData.password;

    if (!emailTrimmed || !password) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter both your administrator email and password.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailTrimmed,
          password: password
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success && result.data && result.data.token) {
        // Securely persist JWT token and admin info in localStorage
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem(
          'adminUser',
          JSON.stringify({
            email: result.data.email,
            name: result.data.name,
            role: result.data.role
          })
        );

        setStatusMessage({
          type: 'success',
          text: `Welcome, ${result.data.name || result.data.email}! Redirecting to Dashboard...`
        });

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(result.data.token);
          } else if (onNavigate) {
            onNavigate('admin-dashboard');
          } else {
            window.location.href = '/admindashboard';
          }
        }, 350);
      } else {
        const errorMsg =
          result.message || 'Invalid administrator email or password. Please try again.';
        setStatusMessage({
          type: 'error',
          text: errorMsg
        });
      }
    } catch (err) {
      console.error('Authentication request error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Unable to connect to the authentication server. Please ensure the Spring Boot backend is running on port 8080.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Header Branding with Logo at top */}
        <div className="admin-login-header">
          <div className="admin-login-logo-wrap">
            <img
              src={logoImg}
              alt="Sridevi Sarees & Collections"
              className="admin-login-logo"
            />
          </div>
          <h1 className="admin-login-title">Admin Console</h1>
          <p className="admin-login-subtitle">
            Sign in to manage inventory &amp; collections
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
            <label htmlFor="admin-email" className="admin-form-label">
              Email
            </label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">✉️</span>
              <input
                id="admin-email"
                name="email"
                type="text"
                className="admin-form-input admin-input-with-icon"
                placeholder="Sridevisarees.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="username"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label">
              Password
            </label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🔒</span>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="admin-form-input admin-input-with-icon admin-input-with-toggle"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="admin-password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isSubmitting}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="admin-login-submit-btn"
            type="submit"
            className="admin-btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem' }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Quick Action Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(223, 183, 108, 0.2)',
              fontSize: '0.82rem'
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('home');
                else window.location.hash = '#home';
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#777',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              ← Return to Store
            </button>

            <span style={{ color: '#aaa', fontSize: '0.78rem' }}>
              🔒 Protected Portal
            </span>
          </div>
        </form>

        {/* Footer Info */}
        <div className="admin-login-footer">
          <p>© {new Date().getFullYear()} Sridevi Sarees &amp; Collections, Kandukur.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Store Location: Kovur Road, Near Sai Baba Temple
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
