import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Snackbar from '../components/Snackbar';

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.showLoginSuccess) {
      setShowSnackbar(true);
      // Clear the state after showing snackbar
      navigate('/', { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div style={containerStyle}>
      {showSnackbar && (
        <Snackbar
          message="Login successful! Welcome back."
          type="success"
          duration={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      <div style={heroSectionStyle}>
        <h1 style={heroTitleStyle}>
          Welcome to <span style={brandStyle}>CinemaBook</span>
        </h1>
        <p style={heroSubtitleStyle}>
          Discover and book your favorite movies with ease
        </p>

        <div style={ctaContainerStyle}>
          <button
            onClick={() => navigate('/movies')}
            style={primaryButtonStyle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
            Browse Movies
          </button>

          {!user && (
            <button
              onClick={() => navigate('/signin')}
              style={secondaryButtonStyle}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <div style={featuresContainerStyle}>
        <div style={featureCardStyle}>
          <div style={iconContainerStyle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <h3 style={featureTitleStyle}>Latest Movies</h3>
          <p style={featureDescStyle}>Browse the latest blockbusters and indie films</p>
        </div>

        <div style={featureCardStyle}>
          <div style={iconContainerStyle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3 style={featureTitleStyle}>Easy Booking</h3>
          <p style={featureDescStyle}>Book your seats in just a few clicks</p>
        </div>

        <div style={featureCardStyle}>
          <div style={iconContainerStyle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3 style={featureTitleStyle}>Your Account</h3>
          <p style={featureDescStyle}>Track bookings and manage your profile</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ==================== STYLES ====================
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
  padding: '40px 20px',
};

const heroSectionStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '80px auto 100px',
  textAlign: 'center',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: '56px',
  fontWeight: 800,
  color: '#f8fafc',
  marginBottom: '20px',
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
};

const brandStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: '20px',
  color: '#94a3b8',
  marginBottom: '48px',
  maxWidth: '600px',
  margin: '0 auto 48px',
};

const ctaContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  transition: 'all 0.2s ease',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '16px 32px',
  background: 'transparent',
  color: '#e2e8f0',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
};

const featuresContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '32px',
};

const featureCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  padding: '40px 32px',
  borderRadius: '20px',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  transition: 'transform 0.2s ease',
};

const iconContainerStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  background: 'rgba(59, 130, 246, 0.1)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
};

const featureTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#f8fafc',
  marginBottom: '12px',
};

const featureDescStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#94a3b8',
  lineHeight: 1.6,
};

export default HomePage;