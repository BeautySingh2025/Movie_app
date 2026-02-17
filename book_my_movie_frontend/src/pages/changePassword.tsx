import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      setLoading(true);

      const res = await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Weak", color: "#ef4444" };
    if (password.length < 10) return { strength: 2, label: "Medium", color: "#f59e0b" };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: "Strong", color: "#22c55e" };
    }
    return { strength: 2, label: "Medium", color: "#f59e0b" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
        top: "-150px",
        right: "-150px",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        animation: "float 18s ease-in-out infinite"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "-100px",
        left: "-100px",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 22s ease-in-out infinite reverse"
      }} />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(40px, -40px); }
            66% { transform: translate(-30px, 30px); }
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
          
          .back-button:hover {
            background: rgba(30, 41, 59, 0.6);
            transform: translateX(-4px);
          }
        `}
      </style>

      <div style={{
        maxWidth: "600px",
        margin: "auto",
        position: "relative",
        zIndex: 1
      }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="back-button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(30, 41, 59, 0.4)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "12px",
            padding: "12px 20px",
            color: "#94a3b8",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
            marginBottom: "40px",
            transition: "all 0.3s ease",
            animation: "slideUp 0.4s ease-out"
          }}
        >
          <span style={{ fontSize: "18px" }}>←</span>
          Back to Profile
        </button>

        {/* Header */}
        <div style={{
          marginBottom: "50px",
          animation: "slideUp 0.5s ease-out 0.1s backwards"
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
            marginBottom: "24px",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
          }}>
            🔐
          </div>
          
          <h1 style={{
            fontSize: "48px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em"
          }}>
            Change Password
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "17px",
            margin: 0,
            fontWeight: "400",
            lineHeight: "1.6"
          }}>
            Update your password to keep your account secure
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
          animation: "slideUp 0.6s ease-out 0.2s backwards",
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

          {/* Success/Error Messages */}
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

          <form onSubmit={handleChangePassword}>
            
            {/* Current Password */}
            <div style={{ marginBottom: "28px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                Current Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
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
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                  {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: "28px", position: "relative" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#e2e8f0",
                marginBottom: "10px",
                letterSpacing: "0.01em"
              }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
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
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
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
                  {showNewPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{
                    display: "flex",
                    gap: "6px",
                    marginBottom: "8px"
                  }}>
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: "4px",
                          borderRadius: "2px",
                          background: passwordStrength.strength >= level 
                            ? passwordStrength.color 
                            : "rgba(148, 163, 184, 0.2)",
                          transition: "all 0.3s ease"
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    fontSize: "13px",
                    color: passwordStrength.color,
                    fontWeight: "500"
                  }}>
                    Password strength: {passwordStrength.label}
                  </div>
                </div>
              )}
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
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "16px 50px 16px 18px",
                    background: "rgba(30, 41, 59, 0.4)",
                    border: confirmPassword && newPassword !== confirmPassword
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
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
              {confirmPassword && (
                <div style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: newPassword === confirmPassword ? "#86efac" : "#fca5a5",
                  fontWeight: "500"
                }}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "14px",
              padding: "18px 22px",
              marginBottom: "32px"
            }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#93c5fd",
                marginBottom: "10px"
              }}>
                Password Requirements:
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: "1.8"
              }}>
                <li>At least 6 characters long</li>
                <li>For strong password: 10+ characters with uppercase and numbers</li>
              </ul>
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
                boxShadow: "0 6px 24px rgba(59, 130, 246, 0.3)"
              }}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>

          </form>
        </div>

        {/* Security Tips */}
        <div style={{
          marginTop: "32px",
          padding: "24px",
          background: "rgba(30, 41, 59, 0.3)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "18px",
          animation: "slideUp 0.6s ease-out 0.3s backwards"
        }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#e2e8f0",
            margin: "0 0 14px 0"
          }}>
            💡 Security Tips
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#94a3b8",
            lineHeight: "1.8"
          }}>
            <li>Use a unique password you don't use anywhere else</li>
            <li>Avoid using personal information like birthdays or names</li>
            <li>Consider using a password manager for better security</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ChangePasswordPage;
