import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { movieApi, bookingApi } from '../services/api';
import { Movie } from '../types';
import axios from 'axios';

interface ShowDate {
  show_date: string;
}

interface HallInfo {
  id: number;
  hall_name: string;
  total_seats: number;
  location: string;
}

interface SlotInfo {
  slot: string;
  available_seats?: number;
}

const BookMoviePage: React.FC = () => {
  const { user } = useAuth();
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // State management
  const [movie, setMovie] = useState<Movie | null>(null);
  const [availableDates, setAvailableDates] = useState<ShowDate[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableHalls, setAvailableHalls] = useState<HallInfo[]>([]);
  const [selectedHall, setSelectedHall] = useState<HallInfo | null>(null);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const API_BASE = 'http://localhost:8000';

  // Fetch movie details
  useEffect(() => {
    if (movieId) {
      movieApi.getMovieById(movieId)
        .then(res => setMovie(res.data.movie || res.data))
        .catch(() => setError('Failed to load movie'));
    }
  }, [movieId]);

  // Fetch available dates for the movie
  useEffect(() => {
    if (movieId) {
      setLoading(true);
      axios.get(`${API_BASE}/moviehall/dates?movie_id=${movieId}`)
        .then(res => {
          setAvailableDates(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load dates:', err);
          setError('Failed to load available dates');
          setLoading(false);
        });
    }
  }, [movieId]);

  // Fetch halls when date is selected
  useEffect(() => {
    if (movieId && selectedDate) {
      setLoading(true);
      axios.get(`${API_BASE}/moviehall/halls?movie_id=${movieId}&show_date=${selectedDate}`)
        .then(res => {
          setAvailableHalls(res.data);
          setSelectedHall(null);
          setSelectedSlot('');
          setSelectedSeats([]);
          setCurrentStep(2);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load halls:', err);
          setError('Failed to load available halls');
          setLoading(false);
        });
    }
  }, [movieId, selectedDate]);

  // Fetch slots when hall is selected
  useEffect(() => {
    if (movieId && selectedDate && selectedHall) {
      setLoading(true);
      axios.get(`${API_BASE}/moviehall/slots?hall_id=${selectedHall.id}&movie_id=${movieId}&show_date=${selectedDate}`)
        .then(res => {
          setAvailableSlots(res.data);
          setSelectedSlot('');
          setSelectedSeats([]);
          setCurrentStep(3);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load slots:', err);
          setError('Failed to load available time slots');
          setLoading(false);
        });
    }
  }, [movieId, selectedDate, selectedHall]);

  // Fetch booked seats when slot is selected
  useEffect(() => {
    if (movieId && selectedDate && selectedHall && selectedSlot) {
      setLoading(true);
      axios.get(`${API_BASE}/booking/check-seats`, {
        params: {
          movieId: movieId,
          hallId: selectedHall.id,
          booking_date: selectedDate,
          slot_selected: selectedSlot
        }
      })
        .then(res => {
          const booked = res.data.booked_seats || [];
          setBookedSeats(booked);
          setSelectedSeats([]);
          setCurrentStep(4);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load booked seats:', err);
          setError('Failed to load seat availability');
          setLoading(false);
        });
    }
  }, [movieId, selectedDate, selectedHall, selectedSlot]);

  // Generate seat grid based on total_seats
  const generateSeats = () => {
    if (!selectedHall) return [];
    const totalSeats = selectedHall.total_seats;
    const rows = ['A', 'B', 'C'];
    const seatsPerRow = Math.ceil(totalSeats / rows.length);
    const seats: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= 10; j++) {
        if (seats.length < totalSeats) {
          seats.push(`${j}${rows[i]}`);
        }
      }
    }
    return seats;
  };

  const allSeats = generateSeats();

  // Organize seats by row
  const seatsByRow = allSeats.reduce((acc, seat) => {
    const row = seat.slice(-1);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, string[]>);

  const sortedRows = Object.keys(seatsByRow).sort();

  // Toggle seat selection
  const toggleSeat = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : prev.length < 10 ? [...prev, seatNumber] : prev
    );
  };

  // Calculate total price (assuming $15 per seat, adjust as needed)
  const pricePerSeat = 15;
  const totalPrice = selectedSeats.length * pricePerSeat;

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('Please sign in');
    if (!selectedDate) return setError('Select a date');
    if (!selectedHall) return setError('Select a hall');
    if (!selectedSlot) return setError('Select a time slot');
    if (selectedSeats.length === 0) return setError('Select at least one seat');

    navigate('/payment', {
      state: {
        bookingDetails: {
          user_id: user.id,
          movie_id: Number(movieId),
          hall_id: selectedHall.id,
          slot_selected: selectedSlot,
          booking_date: selectedDate,
          seats_selected: selectedSeats.join(','),
          total_seats: selectedSeats.length,
          total_amount: totalPrice,
          movie_title: movie?.title,
          movie_image: movie?.image,
          hall_name: selectedHall.hall_name,
        },
      },
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#ffffff",
      padding: "80px 20px",
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
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .date-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
          }
          
          .hall-card:hover {
            transform: translateY(-3px);
            border-color: rgba(59, 130, 246, 0.5);
          }
          
          .slot-badge:hover {
            transform: scale(1.05);
          }
          
          .seat:hover:not(.booked) {
            transform: scale(1.15);
          }
        `}
      </style>

      <div style={{
        maxWidth: "1200px",
        margin: "auto",
        position: "relative",
        zIndex: 1
      }}>

        {/* Header */}
        <div style={{
          marginBottom: "50px",
          animation: "slideUp 0.6s ease-out"
        }}>
          <h1 style={{
            fontSize: "52px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em"
          }}>
            Book Your Tickets
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "18px",
            margin: 0,
            fontWeight: "400"
          }}>
            Select your preferred date, hall, and seats
          </p>
        </div>

        {/* Movie Details Card */}
        {movie && (
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            padding: "40px",
            borderRadius: "28px",
            marginBottom: "50px",
            display: "flex",
            gap: "35px",
            alignItems: "flex-start",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.6s ease-out 0.1s backwards",
            position: "relative",
            overflow: "hidden"
          }}>
            
            {/* Decorative corner accent */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)",
              borderRadius: "0 28px 0 100%"
            }} />

            <img
              src={movie.image}
              alt={movie.title}
              style={{
                width: "170px",
                height: "255px",
                borderRadius: "18px",
                objectFit: "cover",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                position: "relative",
                zIndex: 1
              }}
            />
            
            <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "700",
                margin: "0 0 14px 0",
                color: "#ffffff"
              }}>
                {movie.title}
              </h2>
              
              <div style={{
                display: "flex",
                gap: "24px",
                color: "#94a3b8",
                fontSize: "16px",
                marginBottom: "24px"
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  ⏱ {Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  ⭐ {movie.rating}/10
                </span>
              </div>
              
              {/* Progress Steps */}
              <div style={{
                display: "flex",
                gap: "14px",
                marginTop: "28px"
              }}>
                {[
                  { num: 1, label: "Date" },
                  { num: 2, label: "Hall" },
                  { num: 3, label: "Time" },
                  { num: 4, label: "Seats" }
                ].map(step => (
                  <div key={step.num} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: currentStep >= step.num 
                        ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                        : "rgba(148, 163, 184, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      fontWeight: "700",
                      transition: "all 0.3s ease",
                      boxShadow: currentStep >= step.num 
                        ? "0 4px 12px rgba(59, 130, 246, 0.3)" 
                        : "none"
                    }}>
                      {step.num}
                    </div>
                    <span style={{
                      fontSize: "14px",
                      color: currentStep >= step.num ? "#ffffff" : "#64748b",
                      fontWeight: "600"
                    }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "18px 24px",
            borderRadius: "16px",
            marginBottom: "35px",
            color: "#fca5a5",
            fontSize: "15px",
            animation: "slideUp 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "20px" }}>⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Date Selection */}
          <div style={{
            marginBottom: "50px",
            animation: "slideUp 0.6s ease-out 0.2s backwards"
          }}>
            <h3 style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "24px",
              color: "#ffffff"
            }}>
              📅 Select Date
            </h3>
            
            {loading && availableDates.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "50px", 
                color: "#64748b",
                background: "rgba(15, 23, 42, 0.4)",
                borderRadius: "20px",
                border: "1px solid rgba(148, 163, 184, 0.1)"
              }}>
                <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                  Loading available dates...
                </div>
              </div>
            ) : availableDates.length === 0 ? (
              <div style={{
                padding: "50px",
                textAlign: "center",
                color: "#64748b",
                background: "rgba(15, 23, 42, 0.4)",
                borderRadius: "20px",
                border: "1px solid rgba(148, 163, 184, 0.1)"
              }}>
                No dates available for this movie
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "18px"
              }}>
                {availableDates.map((dateObj, idx) => {
                  const isSelected = selectedDate === dateObj.show_date;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(dateObj.show_date)}
                      className="date-card"
                      style={{
                        padding: "24px",
                        borderRadius: "18px",
                        border: isSelected 
                          ? "2px solid #3b82f6" 
                          : "1px solid rgba(148, 163, 184, 0.2)",
                        background: isSelected
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(30, 41, 59, 0.4)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        boxShadow: isSelected
                          ? "0 10px 40px rgba(59, 130, 246, 0.2)"
                          : "0 4px 16px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "10px",
                        color: isSelected ? "#93c5fd" : "#ffffff"
                      }}>
                        {new Date(dateObj.show_date).getDate()}
                      </div>
                      <div style={{
                        fontSize: "14px",
                        color: isSelected ? "#bfdbfe" : "#94a3b8",
                        fontWeight: "600"
                      }}>
                        {formatDateDisplay(dateObj.show_date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Hall Selection */}
          {selectedDate && (
            <div style={{
              marginBottom: "50px",
              animation: "slideUp 0.6s ease-out"
            }}>
              <h3 style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "24px",
                color: "#ffffff"
              }}>
                🎭 Select Hall
              </h3>
              
              {loading && availableHalls.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "50px", 
                  color: "#64748b",
                  background: "rgba(15, 23, 42, 0.4)",
                  borderRadius: "20px",
                  border: "1px solid rgba(148, 163, 184, 0.1)"
                }}>
                  <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                    Loading available halls...
                  </div>
                </div>
              ) : availableHalls.length === 0 ? (
                <div style={{
                  padding: "50px",
                  textAlign: "center",
                  color: "#64748b",
                  background: "rgba(15, 23, 42, 0.4)",
                  borderRadius: "20px",
                  border: "1px solid rgba(148, 163, 184, 0.1)"
                }}>
                  No halls available for this date
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "20px"
                }}>
                  {availableHalls.map((hall) => {
                    const isSelected = selectedHall?.id === hall.id;
                    return (
                      <div
                        key={hall.id}
                        onClick={() => setSelectedHall(hall)}
                        className="hall-card"
                        style={{
                          padding: "28px",
                          borderRadius: "18px",
                          border: isSelected 
                            ? "2px solid #3b82f6" 
                            : "1px solid rgba(148, 163, 184, 0.2)",
                          background: isSelected
                            ? "rgba(59, 130, 246, 0.12)"
                            : "rgba(30, 41, 59, 0.4)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: isSelected
                            ? "0 10px 40px rgba(59, 130, 246, 0.2)"
                            : "0 4px 16px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <h4 style={{
                          fontSize: "19px",
                          fontWeight: "700",
                          margin: "0 0 10px 0",
                          color: isSelected ? "#93c5fd" : "#ffffff"
                        }}>
                          {hall.hall_name}
                        </h4>
                        <p style={{
                          color: "#94a3b8",
                          fontSize: "14px",
                          margin: "0 0 16px 0",
                          lineHeight: "1.5"
                        }}>
                          📍 {hall.location}
                        </p>
                        <div style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          background: "rgba(59, 130, 246, 0.2)",
                          borderRadius: "10px",
                          fontSize: "14px",
                          color: "#bfdbfe",
                          fontWeight: "600"
                        }}>
                          💺 {hall.total_seats} seats
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Slot Selection */}
          {selectedHall && (
            <div style={{
              marginBottom: "50px",
              animation: "slideUp 0.6s ease-out"
            }}>
              <h3 style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "24px",
                color: "#ffffff"
              }}>
                🕐 Select Time Slot
              </h3>
              
              {loading && availableSlots.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "50px", 
                  color: "#64748b",
                  background: "rgba(15, 23, 42, 0.4)",
                  borderRadius: "20px",
                  border: "1px solid rgba(148, 163, 184, 0.1)"
                }}>
                  <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                    Loading available time slots...
                  </div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div style={{
                  padding: "50px",
                  textAlign: "center",
                  color: "#64748b",
                  background: "rgba(15, 23, 42, 0.4)",
                  borderRadius: "20px",
                  border: "1px solid rgba(148, 163, 184, 0.1)"
                }}>
                  No time slots available for this hall
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap"
                }}>
                  {availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.slot;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSlot(slot.slot)}
                        className="slot-badge"
                        style={{
                          padding: "18px 32px",
                          borderRadius: "14px",
                          border: isSelected 
                            ? "2px solid #3b82f6" 
                            : "1px solid rgba(148, 163, 184, 0.2)",
                          background: isSelected
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(30, 41, 59, 0.4)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: isSelected
                            ? "0 8px 24px rgba(59, 130, 246, 0.3)"
                            : "none"
                        }}
                      >
                        <div style={{
                          fontSize: "19px",
                          fontWeight: "700",
                          color: isSelected ? "#ffffff" : "#e2e8f0",
                          marginBottom: slot.available_seats !== undefined ? "6px" : "0"
                        }}>
                          {slot.slot}
                        </div>
                        {slot.available_seats !== undefined && (
                          <div style={{
                            fontSize: "13px",
                            color: isSelected ? "#bfdbfe" : "#94a3b8",
                            fontWeight: "500"
                          }}>
                            {slot.available_seats} seats left
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Seat Selection */}
          {selectedSlot && (
            <div style={{
              marginBottom: "50px",
              animation: "slideUp 0.6s ease-out"
            }}>
              <h3 style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "24px",
                color: "#ffffff"
              }}>
                💺 Select Your Seats
              </h3>
              
              {loading ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "50px", 
                  color: "#64748b",
                  background: "rgba(15, 23, 42, 0.4)",
                  borderRadius: "20px",
                  border: "1px solid rgba(148, 163, 184, 0.1)"
                }}>
                  <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                    Loading seat availability...
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  borderRadius: "28px",
                  padding: "50px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
                }}>
                  {/* Screen */}
                  <div style={{
                    marginBottom: "60px",
                    textAlign: "center"
                  }}>
                    <div style={{
                      height: "8px",
                      background: "linear-gradient(90deg, transparent 0%, #3b82f6 20%, #60a5fa 50%, #3b82f6 80%, transparent 100%)",
                      borderRadius: "4px",
                      marginBottom: "16px",
                      boxShadow: "0 6px 24px rgba(59, 130, 246, 0.4)"
                    }} />
                    <div style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "3px",
                      textTransform: "uppercase"
                    }}>
                      Screen
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "40px"
                  }}>
                    {sortedRows.map(row => (
                      <div key={row} style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center"
                      }}>
                        <div style={{
                          width: "35px",
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "#64748b",
                          textAlign: "center"
                        }}>
                          {row}
                        </div>
                        
                        {seatsByRow[row]
                          .sort((a, b) => parseInt(a) - parseInt(b))
                          .map(seat => {
                            const isBooked = bookedSeats.includes(seat);
                            const isSelected = selectedSeats.includes(seat);
                            
                            return (
                              <div
                                key={seat}
                                onClick={() => toggleSeat(seat)}
                                className="seat"
                                style={{
                                  width: "46px",
                                  height: "46px",
                                  borderRadius: "10px 10px 3px 3px",
                                  background: isBooked 
                                    ? "rgba(30, 41, 59, 0.5)"
                                    : isSelected
                                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                    : "rgba(51, 65, 85, 0.6)",
                                  border: isSelected
                                    ? "2px solid #93c5fd"
                                    : "1px solid rgba(148, 163, 184, 0.3)",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  color: isBooked ? "#475569" : "#ffffff",
                                  transition: "all 0.2s ease",
                                  opacity: isBooked ? 0.4 : 1,
                                  boxShadow: isSelected
                                    ? "0 6px 20px rgba(59, 130, 246, 0.4)"
                                    : "0 3px 10px rgba(0, 0, 0, 0.2)"
                                }}
                              >
                                {seat}
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div style={{
                    display: "flex",
                    gap: "28px",
                    justifyContent: "center",
                    marginBottom: "35px",
                    flexWrap: "wrap"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: "rgba(51, 65, 85, 0.6)",
                        border: "1px solid rgba(148, 163, 184, 0.3)"
                      }} />
                      <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>Available</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        border: "2px solid #93c5fd"
                      }} />
                      <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>Selected</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: "rgba(30, 41, 59, 0.5)",
                        opacity: 0.4
                      }} />
                      <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>Booked</span>
                    </div>
                  </div>

                  {/* Selected Seats Info */}
                  {selectedSeats.length > 0 && (
                    <div style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "18px",
                      padding: "24px",
                      marginTop: "24px"
                    }}>
                      <div style={{
                        fontSize: "14px",
                        color: "#94a3b8",
                        marginBottom: "10px",
                        fontWeight: "600"
                      }}>
                        Selected Seats ({selectedSeats.length})
                      </div>
                      <div style={{
                        fontSize: "17px",
                        color: "#ffffff",
                        fontWeight: "600",
                        marginBottom: "18px"
                      }}>
                        {selectedSeats.join(", ")}
                      </div>
                      <div style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}>
                        ${totalPrice.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {selectedSeats.length > 0 && (
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "22px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#ffffff",
                borderRadius: "18px",
                border: "none",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)",
                animation: "slideUp 0.6s ease-out"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 15px 50px rgba(59, 130, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(59, 130, 246, 0.4)";
              }}
            >
              Proceed to Payment →
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookMoviePage;
