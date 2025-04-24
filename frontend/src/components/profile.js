import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/get-session", {
          withCredentials: true
        });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setError("No user session found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8090/logout", {
        withCredentials: true
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-not-found">
        <h2>No user found</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={user.image?.replace('=s96-c', '=s200-c') || "https://via.placeholder.com/200"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <h1 className="profile-name">{user.displayName || "User"}</h1>
        <p className="profile-email">{user.gmail || "No email provided"}</p>
      </div>

      <div className="profile-details">
        <div className="detail-card">
          <h3>Account Information</h3>
          <div className="detail-item">
            <span className="detail-label">User ID:</span>
            <span className="detail-value">{user._id || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account Created:</span>
            <span className="detail-value">
              {new Date(user.createdAt).toLocaleDateString() || "N/A"}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .profile-image-container {
          width: 150px;
          height: 150px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #f0f0f0;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .profile-email {
          color: #666;
          font-size: 1.1rem;
        }

        .profile-details {
          margin-top: 2rem;
        }

        .detail-card {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .detail-card h3 {
          margin-top: 0;
          color: #444;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .detail-label {
          font-weight: 600;
          color: #555;
        }

        .detail-value {
          color: #333;
        }

        .profile-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-profile-btn {
          background-color: #3498db;
          color: white;
        }

        .edit-profile-btn:hover {
          background-color: #2980b9;
        }

        .logout-btn {
          background-color: #e74c3c;
          color: white;
        }

        .logout-btn:hover {
          background-color: #c0392b;
        }

        .profile-loading {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .profile-error, .profile-not-found {
          text-align: center;
          padding: 2rem;
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .profile-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;