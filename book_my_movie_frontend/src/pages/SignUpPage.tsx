import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { SignUpData } from '../types';
import { toast } from 'sonner';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setMessage(response.data.message);

      toast.success('OTP sent successfully',{
              duration : 1000})
      // Redirect to verify OTP page
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

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
          
          .input-field:focus {
            border-color: rgba(59, 130, 246, 0.6);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            outline: none;
          }
          
          .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
          }
          
          .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .link-hover:hover {
            color: #60a5fa;
          }
        `}
      </style>

      <div style={{
        maxWidth: "500px",
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
            👤
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
            Create Account
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "16px",
            margin: 0,
            fontWeight: "400"
          }}>
            Join us to start booking amazing movies
          </p>
        </div>

        {/* Form Card */}
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

          {/* Success Message */}
          {message && (
            <div style={{
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "30px",
              color: "#86efac",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "scaleIn 0.3s ease-out"
            }}>
              <span style={{ fontSize: "20px" }}>✓</span>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "30px",
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

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div style={{ marginBottom: "28px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
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

            {/* Email Address */}
            <div style={{ marginBottom: "28px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
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

            {/* Password */}
            <div style={{ marginBottom: "28px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Create a password (min 6 characters)"
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "16px 50px 16px 18px",
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    padding: "8px"
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "36px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "16px 50px 16px 18px",
                    background: "rgba(30, 41, 59, 0.4)",
                    border: formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    padding: "8px"
                  }}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: formData.password === formData.confirmPassword ? "#86efac" : "#fca5a5",
                  fontWeight: "500"
                }}>
                  {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
              style={{
                width: "100%",
                padding: "18px",
                background: loading 
                  ? "rgba(59, 130, 246, 0.4)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                border: "none",
                borderRadius: "14px",
                color: "#ffffff",
                fontSize: "17px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 6px 24px rgba(59, 130, 246, 0.3)",
                marginBottom: "24px"
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Sign In Link */}
            <div style={{
              textAlign: "center",
              fontSize: "15px",
              color: "#94a3b8"
            }}>
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="link-hover"
                style={{ 
                  color: "#60a5fa", 
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "color 0.3s ease"
                }}
              >
                Sign In
              </Link>
            </div>

          </form>
        </div>

        {/* Additional Info */}
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
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
