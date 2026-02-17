import React, { useState, useEffect } from 'react';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie, PaginationParams } from '../types';
import { ITEMS_PER_PAGE } from '../utils/constants';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies(pagination.page);
  }, [pagination.page]);

  const fetchMovies = async (page: number, searchTerm?: string) => {
    try {
      setLoading(true);
      const response = await movieApi.getAllMovies();
      const allMovies = response.data.movies || [];

      let filtered = allMovies;
      if (searchTerm) {
        filtered = allMovies.filter(
          (movie: Movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setMovies(paginated);
      setPagination({ page, limit: ITEMS_PER_PAGE, total, totalPages });
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, page }));
  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchMovies(1);
  };

  if (loading && movies.length === 0) {
    return (
      <div style={loadingContainerStyle}>
        <LoadingSpinner size="large" />
        <p style={loadingTextStyle}>Loading movies...</p>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div style={errorContainerStyle}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginBottom: '16px' }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <p style={errorTextStyle}>{error}</p>
        <button onClick={() => fetchMovies(1)} style={retryButtonStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <h2 style={titleStyle}>
            Now Showing
            {pagination.total > 0 && (
              <span style={countBadgeStyle}>{pagination.total}</span>
            )}
          </h2>
          <p style={subtitleStyle}>Discover your next favorite movie</p>
        </div>

        <form onSubmit={handleSearch} style={searchFormStyle}>
          <div style={searchInputContainerStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={searchIconStyle}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search movies by title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) {
                  setPagination(prev => ({ ...prev, page: 1 }));
                  fetchMovies(1, e.target.value);
                } else if (e.target.value === "") {
                  setPagination(prev => ({ ...prev, page: 1 }));
                  fetchMovies(1);
                }
              }}
              style={searchInputStyle}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setPagination(prev => ({ ...prev, page: 1 }));
                  fetchMovies(1);
                }}
                style={clearButtonStyle}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {movies.length === 0 ? (
        <div style={emptyStateStyle}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" style={{ marginBottom: '20px' }}>
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
          <p style={emptyTitleStyle}>
            {searchTerm ? "No movies found" : "No movies available"}
          </p>
          <p style={emptyDescStyle}>
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Check back later for new releases"}
          </p>
        </div>
      ) : (
        <>
          <div style={moviesGridStyle}>
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={paginationWrapperStyle}>
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
  padding: '40px 20px',
};

const headerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const titleContainerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: '42px',
  fontWeight: 800,
  color: '#f8fafc',
  margin: '0 0 8px 0',
  letterSpacing: '-0.03em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const countBadgeStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#fff',
  padding: '6px 16px',
  borderRadius: '20px',
  border: '1px solid rgba(59, 130, 246, 0.3)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#94a3b8',
  margin: 0,
};

const searchFormStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  width: '100%',
};

const searchInputContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(30, 41, 59, 0.6)',
  borderRadius: '16px',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  padding: '4px 4px 4px 16px',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
};

const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '16px',
  pointerEvents: 'none',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '14px 14px 14px 36px',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: '15px',
  color: '#f8fafc',
  fontWeight: 500,
};

const clearButtonStyle: React.CSSProperties = {
  background: 'rgba(148, 163, 184, 0.2)',
  border: 'none',
  borderRadius: '12px',
  padding: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#94a3b8',
  transition: 'all 0.2s ease',
};

const moviesGridStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const paginationWrapperStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '40px auto 0',
};

const loadingContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
};

const loadingTextStyle: React.CSSProperties = {
  marginTop: '20px',
  color: '#94a3b8',
  fontSize: '16px',
  fontWeight: 500,
};

const errorContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
};

const errorTextStyle: React.CSSProperties = {
  color: '#ef4444',
  fontSize: '18px',
  marginBottom: '24px',
  fontWeight: 600,
};

const retryButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.2s ease',
};

const emptyStateStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '80px auto',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#e2e8f0',
  margin: '0 0 8px 0',
};

const emptyDescStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#64748b',
  margin: 0,
};

export default MoviesPage;