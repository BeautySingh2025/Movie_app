import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SignInData } from '../types';
import { toast } from 'sonner';

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await userApi.signIn({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      login(response.data.token, response.data.user);
      setMessage('Login successful!');

      toast.success('Logged In Successful',{
        duration : 1000
      })
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
          
          .checkbox-custom {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(148, 163, 184, 0.4);
            border-radius: 6px;
            background: rgba(30, 41, 59, 0.4);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }
          
          .checkbox-custom:checked {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-color: #3b82f6;
          }
          
          .checkbox-custom:checked::after {
            content: '✓';
            position: absolute;
            color: white;
            font-size: 14px;
            font-weight: bold;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
            Welcome Back
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "16px",
            margin: 0,
            fontWeight: "400"
          }}>
            Sign in to continue your movie journey
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
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "36px"
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#e2e8f0",
                fontWeight: "500"
              }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="checkbox-custom"
                />
                Remember me
              </label>
              
              <Link 
                to="/forgot-password" 
                className="link-hover"
                style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "color 0.3s ease"
                }}
              >
                Forgot Password?
              </Link>
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
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <div style={{
              textAlign: "center",
              fontSize: "15px",
              color: "#94a3b8"
            }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="link-hover"
                style={{ 
                  color: "#60a5fa", 
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "color 0.3s ease"
                }}
              >
                Sign Up
              </Link>
            </div>

          </form>
        </div>

        {/* Security Note */}
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
            🔒 Your connection is secure and encrypted
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
