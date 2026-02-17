import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentApi, bookingApi } from "../services/api";
import { PaymentData, CreateBookingData } from "../types";

const FakePaymentPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingDetails = state?.bookingDetails;

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "upi" | "netbanking">("card");

  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    amount: bookingDetails?.total_amount || 0,
  });

  useEffect(() => {
    if (!bookingDetails) setError("No booking info found");
  }, []);

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limited = digitsOnly.slice(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  // Card holder name - only letters and spaces
  const handleCardHolderChange = (value: string) => {
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
    setPaymentData({ ...paymentData, cardHolder: lettersOnly });
  };

  // Expiry date - MM/YY format
  const handleExpiryDateChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    let formatted = digitsOnly;

    if (digitsOnly.length >= 2) {
      const month = digitsOnly.slice(0, 2);
      const year = digitsOnly.slice(2, 4);
      
      // Validate month (01-12)
      const monthNum = parseInt(month);
      if (monthNum > 12) {
        formatted = "12" + year;
      } else if (monthNum === 0) {
        formatted = "01" + year;
      } else {
        formatted = month + (year ? "/" + year : "");
      }
    }

    setPaymentData({ ...paymentData, expiryDate: formatted.slice(0, 5) });
  };

  // CVV - only 3 digits
  const handleCvvChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limited = digitsOnly.slice(0, 3);
    setPaymentData({ ...paymentData, cvv: limited });
  };

  const validatePaymentData = () => {
    if (paymentMethod === "card") {
      if (!paymentData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/))
        return setError("Invalid card"), false;
      if (!paymentData.cardHolder) return setError("Enter name"), false;
      if (!paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
        return setError("Invalid expiry"), false;
      if (!paymentData.cvv.match(/^\d{3}$/))
        return setError("Invalid CVV"), false;
    }

    if (paymentMethod === "upi" && !upiId.match(/.+@.+/))
      return setError("Invalid UPI ID"), false;

    if (paymentMethod === "netbanking" && !bank)
      return setError("Select Bank"), false;

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validatePaymentData()) return;

    setStep(2);

    try {
      await paymentApi.processPayment({
        amount: paymentData.amount,
        method: paymentMethod,
        cardNumber:
          paymentMethod === "card"
            ? paymentData.cardNumber.replace(/\s/g, "")
            : "",
        cardHolder: paymentMethod === "card" ? paymentData.cardHolder : "",
        expiryDate: paymentMethod === "card" ? paymentData.expiryDate : "",
        cvv: paymentMethod === "card" ? paymentData.cvv : "",
        upiId,
        bank,
      });

      const createData: CreateBookingData = {
        ...bookingDetails,
      };

      await bookingApi.createBooking(createData);

      setStep(3);
      setTimeout(() => navigate("/bookings"), 4000);
    } catch (err: any) {
      setError("Payment failed");
      setStep(1);
    }
  };

  if (!bookingDetails) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "16px",
          padding: "20px 30px",
          color: "#fca5a5",
          fontSize: "18px"
        }}>
          No Booking Found
        </div>
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
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
          
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          
          .input-field:focus {
            border-color: rgba(59, 130, 246, 0.6);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            outline: none;
          }
          
          .payment-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
          }
          
          .payment-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .method-button:hover {
            transform: translateY(-2px);
          }
        `}
      </style>

      <div style={{
        maxWidth: "600px",
        width: "100%",
        position: "relative",
        zIndex: 1,
        animation: "slideUp 0.6s ease-out"
      }}>

        {/* Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
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
            💳
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
            Payment
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "16px",
            margin: 0,
            fontWeight: "400"
          }}>
            Complete your booking securely
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
          gap: "10px"
        }}>
          {["Payment", "Processing", "Done"].map((label, index) => (
            <div key={index} style={{
              textAlign: "center",
              flex: 1,
              position: "relative"
            }}>
              <div style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: step > index 
                  ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" 
                  : step === index + 1
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "rgba(30, 41, 59, 0.6)",
                border: step >= index + 1 ? "none" : "2px solid rgba(148, 163, 184, 0.2)",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "700",
                color: step >= index + 1 ? "#ffffff" : "#64748b",
                boxShadow: step >= index + 1 ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                transition: "all 0.3s ease"
              }}>
                {step > index ? "✓" : index + 1}
              </div>
              <div style={{
                fontSize: "13px",
                fontWeight: "600",
                color: step >= index + 1 ? "#e2e8f0" : "#64748b",
                letterSpacing: "0.03em"
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: "28px",
          padding: "50px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}>
          
          {/* Decorative accent */}
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "180px",
            height: "180px",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)",
            borderRadius: "0 28px 0 100%"
          }} />

          {/* Step 1: Payment Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
              
              {/* Amount Display */}
              <div style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "30px",
                textAlign: "center"
              }}>
                <div style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  marginBottom: "8px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Total Amount
                </div>
                <div style={{
                  color: "#60a5fa",
                  fontSize: "36px",
                  fontWeight: "700"
                }}>
                  ${paymentData.amount}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: "30px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#e2e8f0",
                  marginBottom: "12px",
                  letterSpacing: "0.01em"
                }}>
                  Payment Method
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { value: "card", label: "Card", icon: "💳" },
                    { value: "upi", label: "UPI", icon: "📱" },
                    { value: "netbanking", label: "Net Banking", icon: "🏦" }
                  ].map((method: any) => (
                    <button
                      type="button"
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className="method-button"
                      style={{
                        flex: 1,
                        padding: "14px 12px",
                        background: paymentMethod === method.value
                          ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                          : "rgba(30, 41, 59, 0.4)",
                        border: paymentMethod === method.value 
                          ? "1px solid rgba(59, 130, 246, 0.5)"
                          : "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "12px",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: paymentMethod === method.value
                          ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                          : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Payment Fields */}
              {paymentMethod === "card" && (
                <div style={{ animation: "scaleIn 0.3s ease-out" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#e2e8f0",
                      marginBottom: "10px",
                      letterSpacing: "0.01em"
                    }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "16px 18px",
                        background: "rgba(30, 41, 59, 0.4)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "14px",
                        color: "#ffffff",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        letterSpacing: "0.05em"
                      }}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#e2e8f0",
                      marginBottom: "10px",
                      letterSpacing: "0.01em"
                    }}>
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardHolder}
                      onChange={(e) => handleCardHolderChange(e.target.value)}
                      className="input-field"
                      style={{
                        width: "100%",
                        padding: "16px 18px",
                        background: "rgba(30, 41, 59, 0.4)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        borderRadius: "14px",
                        color: "#ffffff",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#e2e8f0",
                        marginBottom: "10px",
                        letterSpacing: "0.01em"
                      }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleExpiryDateChange(e.target.value)}
                        className="input-field"
                        style={{
                          width: "100%",
                          padding: "16px 18px",
                          background: "rgba(30, 41, 59, 0.4)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "14px",
                          color: "#ffffff",
                          fontSize: "16px",
                          transition: "all 0.3s ease",
                          boxSizing: "border-box"
                        }}
                        maxLength={5}
                        required
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#e2e8f0",
                        marginBottom: "10px",
                        letterSpacing: "0.01em"
                      }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        className="input-field"
                        style={{
                          width: "100%",
                          padding: "16px 18px",
                          background: "rgba(30, 41, 59, 0.4)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "14px",
                          color: "#ffffff",
                          fontSize: "16px",
                          transition: "all 0.3s ease",
                          boxSizing: "border-box"
                        }}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Fields */}
              {paymentMethod === "upi" && (
                <div style={{ marginBottom: "20px", animation: "scaleIn 0.3s ease-out" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#e2e8f0",
                    marginBottom: "10px",
                    letterSpacing: "0.01em"
                  }}>
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input-field"
                    style={{
                      width: "100%",
                      padding: "16px 18px",
                      background: "rgba(30, 41, 59, 0.4)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "14px",
                      color: "#ffffff",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                    required
                  />
                </div>
              )}

              {/* Net Banking Fields */}
              {paymentMethod === "netbanking" && (
                <div style={{ marginBottom: "20px", animation: "scaleIn 0.3s ease-out" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#e2e8f0",
                    marginBottom: "10px",
                    letterSpacing: "0.01em"
                  }}>
                    Select Bank
                  </label>
                  <select
                    className="input-field"
                    style={{
                      width: "100%",
                      padding: "16px 18px",
                      background: "rgba(30, 41, 59, 0.4)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "14px",
                      color: "#ffffff",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                    onChange={(e) => setBank(e.target.value)}
                    required
                  >
                    <option value="" style={{ background: "#0f172a" }}>Select Bank</option>
                    <option value="SBI" style={{ background: "#0f172a" }}>State Bank of India</option>
                    <option value="HDFC" style={{ background: "#0f172a" }}>HDFC Bank</option>
                    <option value="ICICI" style={{ background: "#0f172a" }}>ICICI Bank</option>
                    <option value="Axis" style={{ background: "#0f172a" }}>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  marginBottom: "24px",
                  color: "#fca5a5",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "shake 0.4s ease-out"
                }}>
                  <span style={{ fontSize: "20px" }}>⚠</span>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="payment-button"
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontSize: "17px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 6px 24px rgba(59, 130, 246, 0.3)"
                }}
              >
                Pay ₹{paymentData.amount}
              </button>

            </form>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              animation: "scaleIn 0.3s ease-out"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                border: "4px solid rgba(59, 130, 246, 0.2)",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                margin: "0 auto 30px",
                animation: "spin 1s linear infinite"
              }} />
              <h2 style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0 0 12px 0",
                color: "#f8fafc"
              }}>
                Processing Payment
              </h2>
              <p style={{
                color: "#94a3b8",
                fontSize: "16px",
                margin: 0
              }}>
                Please wait while we process your payment...
              </p>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              animation: "scaleIn 0.3s ease-out"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                margin: "0 auto 30px",
                boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)",
                animation: "pulse 2s ease-in-out infinite"
              }}>
                ✓
              </div>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: "0 0 12px 0",
                color: "#22c55e"
              }}>
                Payment Successful!
              </h2>
              <p style={{
                color: "#94a3b8",
                fontSize: "16px",
                margin: "0 0 24px 0"
              }}>
                Your booking has been confirmed
              </p>
              <div style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "12px",
                padding: "12px 20px",
                color: "#86efac",
                fontSize: "14px",
                display: "inline-block"
              }}>
                Redirecting to bookings...
              </div>
            </div>
          )}

        </div>

        {/* Security Note */}
        {step === 1 && (
          <div style={{
            marginTop: "28px",
            padding: "20px",
            background: "rgba(30, 41, 59, 0.3)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "18px",
            textAlign: "center"
          }}>
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: "1.6"
            }}>
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FakePaymentPage;
