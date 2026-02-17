import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { User } from "../types";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await userApi.getUser();
      setUserData(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
          Loading your profile...
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

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
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          .profile-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
          }
          
          .action-button:hover {
            transform: translateX(4px);
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          }
        `}
      </style>

      <div style={{
        maxWidth: "800px",
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
            My Profile
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "18px",
            margin: 0,
            fontWeight: "400"
          }}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div 
          className="profile-card"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "28px",
            padding: "50px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: "slideUp 0.6s ease-out 0.1s backwards",
            position: "relative",
            overflow: "hidden"
          }}
        >
          
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

          {/* Avatar Section */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            marginBottom: "50px",
            position: "relative"
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "700",
              color: "#ffffff",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Shimmer effect */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                animation: "shimmer 3s infinite"
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>
                {userData?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: "0 0 8px 0",
                color: "#ffffff"
              }}>
                {userData?.name}
              </h2>
              <p style={{
                color: "#94a3b8",
                fontSize: "16px",
                margin: 0
              }}>
                {userData?.email}
              </p>
            </div>
          </div>

          {/* Account Details Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginBottom: "40px"
          }}>
            
            {/* Email */}
            <div style={{
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease"
            }}>
              <div style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600"
              }}>
                Email Address
              </div>
              <div style={{
                color: "#e2e8f0",
                fontSize: "16px",
                fontWeight: "500",
                wordBreak: "break-word"
              }}>
                {userData?.email}
              </div>
            </div>

            {/* Verification Status */}
            <div style={{
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease"
            }}>
              <div style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600"
              }}>
                Verification Status
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: userData?.is_verified ? "#22c55e" : "#ef4444",
                  boxShadow: userData?.is_verified 
                    ? "0 0 10px rgba(34, 197, 94, 0.5)" 
                    : "0 0 10px rgba(239, 68, 68, 0.5)"
                }} />
                <span style={{
                  color: userData?.is_verified ? "#86efac" : "#fca5a5",
                  fontSize: "16px",
                  fontWeight: "600"
                }}>
                  {userData?.is_verified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            {/* Account Status */}
            <div style={{
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease"
            }}>
              <div style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600"
              }}>
                Account Status
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: userData?.is_active ? "#22c55e" : "#ef4444",
                  boxShadow: userData?.is_active 
                    ? "0 0 10px rgba(34, 197, 94, 0.5)" 
                    : "0 0 10px rgba(239, 68, 68, 0.5)"
                }} />
                <span style={{
                  color: userData?.is_active ? "#86efac" : "#fca5a5",
                  fontSize: "16px",
                  fontWeight: "600"
                }}>
                  {userData?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div style={{
              background: "rgba(30, 41, 59, 0.4)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease"
            }}>
              <div style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600"
              }}>
                Member Since
              </div>
              <div style={{
                color: "#e2e8f0",
                fontSize: "16px",
                fontWeight: "500"
              }}>
                {userData?.created_at 
                  ? new Date(userData.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : "N/A"}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.2) 50%, transparent 100%)",
            margin: "40px 0"
          }} />

          {/* Actions Section */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              color: "#e2e8f0"
            }}>
              Account Actions
            </h3>

            {/* Change Password Button */}
            <button
              onClick={() => navigate('/change-password')}
              className="action-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 28px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "16px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: "100%"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  🔐
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    Change Password
                  </div>
                  <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Update your account security
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "20px", color: "#60a5fa" }}>→</div>
            </button>

            {/* Additional action buttons can go here */}
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;
