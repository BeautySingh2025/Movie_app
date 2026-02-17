import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Booking, PaginationParams } from '../types';
import { ITEMS_PER_PAGE } from '../utils/constants';
import { toast } from 'sonner';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchBookings(pagination.page);
    }
  }, [user, pagination.page]);

  const fetchBookings = async (page: number) => {
    try {
      setLoading(true);
      const response = await bookingApi.getBookingsByUser(user!.id);
      
      // 🚨 LOG THE FULL RESPONSE – REMOVE AFTER DEBUGGING
      console.log('📦 Bookings API response:', response.data);

      // ----- EXTRACT BOOKINGS ARRAY FROM COMMON RESPONSE SHAPES -----
      let bookingsArray: Booking[] = [];
      const data = response.data;

      if (Array.isArray(data)) {
        bookingsArray = data;                                 // plain array
      } else if (data?.data && Array.isArray(data.data)) {
        bookingsArray = data.data;                           // { data: [...] }
      } else if (data?.bookings && Array.isArray(data.bookings)) {
        bookingsArray = data.bookings;                       // { bookings: [...] }
      } else if (data?.result && Array.isArray(data.result)) {
        bookingsArray = data.result;                         // { result: [...] }
      } else if (typeof data === 'object' && data !== null) {
        // Fallback: try to find the first array property
        const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        if (firstArrayKey) {
          bookingsArray = data[firstArrayKey];
        }
      }

      // Ensure each booking has required fields (set defaults for missing)
      const normalizedBookings = bookingsArray.map((b: any) => ({
        id: b.id,
        user_id: b.user_id,
        movie_id: b.movie_id,
        hall_id: b.hall_id,
        slot_selected: b.slot_selected,
        booking_date: b.booking_date,
        seats_selected: b.seats_selected,
        total_seats: b.total_seats,
        total_amount: Number(b.total_amount) || 0,
        payment_status: b.payment_status || 'SUCCESS',
        booking_status: b.booking_status || 'CONFIRMED',
        created_at: b.created_at,
        // Optional fields – keep as is if present
        movie_title: b.movie_title,
        movie_image: b.movie_image,
        hall_name: b.hall_name,
      }));

      // Pagination (client‑side – you can later switch to server‑side pagination)
      const total = normalizedBookings.length;
      const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginated = normalizedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setBookings(paginated);
      setPagination({ page, limit: ITEMS_PER_PAGE, total, totalPages });
    } catch (err: any) {
      console.error('❌ Failed to fetch bookings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleCancelBooking = async (bookingId: number) => {
    
    setCancellingId(bookingId);
    try {
      await bookingApi.cancelBooking(bookingId);
      // Refresh current page
      fetchBookings(pagination.page);
      toast.success('Booking Cancel Successfully',{
        duration:2000
      })
    } catch (err: any) {
      console.error('❌ Cancel failed:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && bookings.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 15s ease-in-out infinite"
        }} />
        
        <LoadingSpinner size="large" />
        <p style={{ marginTop: '20px', color: '#94a3b8', fontSize: '16px', position: 'relative', zIndex: 1 }}>
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(70px)",
          animation: "float 20s ease-in-out infinite reverse"
        }} />
        
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "16px",
          padding: "20px 30px",
          color: "#fca5a5",
          fontSize: "18px",
          position: "relative",
          zIndex: 1,
          maxWidth: "500px",
          textAlign: "center"
        }}>
          {error}
        </div>
        <button
          onClick={() => fetchBookings(1)}
          style={{
            marginTop: '20px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.3)';
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#ffffff",
      padding: "60px 20px",
      fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "-100px",
        right: "-100px",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 15s ease-in-out infinite"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "-150px",
        left: "-150px",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        animation: "float 20s ease-in-out infinite reverse"
      }} />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(30px, -30px); }
            66% { transform: translate(-20px, 20px); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .booking-card {
            transition: all 0.3s ease;
          }
          
          .booking-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.2);
          }
          
          .cancel-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(239, 68, 68, 0.4);
          }
          
          .cancel-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>

        {/* Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center",
          animation: "slideUp 0.6s ease-out"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 24px",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
          }}>
            🎬
          </div>
          
          <h1 style={{
            fontSize: "42px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em"
          }}>
            My Bookings
          </h1>
          {pagination.total > 0 && (
            <p style={{
              color: "#94a3b8",
              fontSize: "16px",
              margin: 0,
              fontWeight: "400"
            }}>
              {pagination.total} {pagination.total === 1 ? 'booking' : 'bookings'} found
            </p>
          )}
        </div>

        {loading && bookings.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.3s ease' }}>
            <LoadingSpinner size="small" />
          </div>
        )}

        {bookings.length === 0 ? (
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "28px",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.6s ease-out"
          }}>
            <div style={{
              fontSize: "64px",
              marginBottom: "20px"
            }}>
              🎟️
            </div>
            <p style={{
              color: '#94a3b8',
              fontSize: '18px',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              You haven't made any bookings yet.<br />
              Start your movie journey today!
            </p>
            <a
              href="/movies"
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 6px 24px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.3)';
              }}
            >
              Browse Movies
            </a>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '40px' }}>
              {bookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="booking-card"
                  style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    borderRadius: "24px",
                    padding: "30px",
                    marginBottom: "20px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  {/* Decorative accent */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "150px",
                    height: "150px",
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)",
                    borderRadius: "0 24px 0 100%"
                  }} />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '20px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      {/* Header with status badge only */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <h3 style={{
                          margin: 0,
                          color: '#f8fafc',
                          fontSize: '22px',
                          fontWeight: '700',
                          letterSpacing: '-0.02em'
                        }}>
                          Booking #{booking.id}
                        </h3>
                        <span style={{
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: booking.booking_status === 'CANCELLED'
                            ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                            : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                          boxShadow: booking.booking_status === 'CANCELLED'
                            ? '0 4px 12px rgba(220, 38, 38, 0.3)'
                            : '0 4px 12px rgba(14, 165, 233, 0.3)'
                        }}>
                          {booking.booking_status}
                        </span>
                      </div>

                      {/* Booking details grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Movie ID
                          </div>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '17px',
                            fontWeight: '700'
                          }}>
                            {booking.movie_id}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Hall ID
                          </div>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '17px',
                            fontWeight: '600'
                          }}>
                            {booking.hall_id}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Date & Slot
                          </div>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '15px',
                            fontWeight: '600',
                            lineHeight: '1.4'
                          }}>
                            {booking.booking_date}<br />
                            <span style={{ color: '#60a5fa' }}>{booking.slot_selected}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Seats
                          </div>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '17px',
                            fontWeight: '700'
                          }}>
                            {booking.seats_selected}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Total Amount
                          </div>
                          <div style={{
                            color: '#22c55e',
                            fontSize: '20px',
                            fontWeight: '700'
                          }}>
                            ${(booking.total_amount || 0).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '6px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Booked On
                          </div>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            {formatDate(booking.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cancel button */}
                    {booking.booking_status !== 'CANCELLED' && (
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="cancel-button"
                          style={{
                            padding: '12px 24px',
                            background: cancellingId === booking.id
                              ? 'rgba(239, 68, 68, 0.4)'
                              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            cursor: cancellingId === booking.id ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '15px',
                            boxShadow: '0 6px 24px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div style={{
                animation: 'fadeIn 0.6s ease-out 0.3s backwards'
              }}>
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default BookingsPage;
