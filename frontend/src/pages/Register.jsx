import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.timezone
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <div className="auth-badge">Fresh design · Zero clutter</div>
            <div className="auth-logo">
              <span className="auth-logo-icon">📚</span>
              <h1 className="auth-brand-title">Study Planner</h1>
            </div>
            <h2 className="auth-brand-subtitle">Start Your Journey Today</h2>
            <p className="auth-brand-description">
              Join thousands of students who are achieving their academic goals with our powerful study planning platform.
            </p>
            <div className="auth-highlight-grid">
              <div className="auth-highlight-card">
                <div className="auth-highlight-icon">🎯</div>
                <div>
                  <p className="auth-highlight-title">Goal-first workflow</p>
                  <p className="auth-highlight-text">Turn big milestones into weekly wins.</p>
                </div>
              </div>
              <div className="auth-highlight-card">
                <div className="auth-highlight-icon">🌙</div>
                <div>
                  <p className="auth-highlight-title">Comfortable at night</p>
                  <p className="auth-highlight-text">Soft gradients and accessible contrast.</p>
                </div>
              </div>
            </div>
            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Free Forever</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Smart AI Scheduling</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">✓</span>
                <span>Sync Across All Devices</span>
              </div>
            </div>
          </div>
          <div className="auth-branding-decoration"></div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <div className="auth-pill">Takes under 60 seconds</div>
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-subtitle">Sign up to get started with Study Planner</p>
            </div>

            {error && (
              <div className="alert alert-error auth-alert">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="form-label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input auth-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="form-label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input auth-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="form-label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="form-input auth-input"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="form-label-icon">🔐</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input auth-input"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-secondary-panel">
              <div className="auth-secondary-item">
                <span className="auth-secondary-icon">🧭</span>
                <div>
                  <p className="auth-secondary-title">Guided onboarding</p>
                  <p className="auth-secondary-text">We tailor your dashboard to your study style.</p>
                </div>
              </div>
              <div className="auth-secondary-item">
                <span className="auth-secondary-icon">💡</span>
                <div>
                  <p className="auth-secondary-title">Tips that meet you</p>
                  <p className="auth-secondary-text">Contextual hints keep you moving, not guessing.</p>
                </div>
              </div>
            </div>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
            <div className="auth-support">
              <span className="auth-support-bubble">Have questions?</span>
              <span className="auth-support-text">We reply within a day: support@studyplanner.app</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


