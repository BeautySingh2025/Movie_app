import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const getImageUrl = () => {
    if (!movie.image) return null;
    if (typeof movie.image === 'string') {
      if (
        movie.image.length > 100 &&
        !movie.image.startsWith('http') &&
        !movie.image.includes('\\') &&
        !movie.image.includes('/')
      ) {
        return `data:image/jpeg;base64,${movie.image}`;
      }
      if (movie.image.startsWith('data:image')) return movie.image;
      return movie.image;
    }
    return null;
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const imageUrl = getImageUrl();

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img
          src={imageUrl || ''}
          alt={movie.title}
          style={imageStyle}
        />
        <div style={ratingBadgeStyle}>
          <span style={{ fontSize: '14px' }}>⭐</span>
          <span style={{ marginLeft: '4px', fontWeight: 600 }}>{movie.rating}</span>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{movie.title}</h3>
          <div style={durationBadgeStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {formatDuration(movie.duration_minutes)}
          </div>
        </div>

        <p style={descriptionStyle}>{movie.description}</p>

        <Link to={`/book-movie/${movie.id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
          <button style={bookButtonStyle}>
            <span>Book Tickets</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const cardStyle: React.CSSProperties = {
  display: 'flex',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1)',
  overflow: 'hidden',
  marginBottom: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  position: 'relative',
};

const imageContainerStyle: React.CSSProperties = {
  position: 'relative',
  flexShrink: 0,
};

const imageStyle: React.CSSProperties = {
  width: '200px',
  height: '280px',
  objectFit: 'cover',
  display: 'block',
};

const ratingBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(10px)',
  padding: '6px 12px',
  borderRadius: '20px',
  color: '#fbbf24',
  fontSize: '13px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(251, 191, 36, 0.3)',
};

const contentStyle: React.CSSProperties = {
  padding: '28px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  color: '#e2e8f0',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
  gap: '16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  margin: 0,
  color: '#f8fafc',
  letterSpacing: '-0.02em',
  lineHeight: 1.3,
};

const durationBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  background: 'rgba(100, 116, 139, 0.2)',
  borderRadius: '8px',
  fontSize: '13px',
  color: '#cbd5e1',
  fontWeight: 500,
  border: '1px solid rgba(148, 163, 184, 0.2)',
  whiteSpace: 'nowrap',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#94a3b8',
  lineHeight: 1.6,
  marginBottom: '20px',
  flex: 1,
};

const bookButtonStyle: React.CSSProperties = {
  padding: '14px 28px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  width: '100%',
};

export default MovieCard;