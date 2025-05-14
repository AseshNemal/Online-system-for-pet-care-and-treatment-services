import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ProfileNew = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/get-session");
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setError("No user session found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h2>No user found</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || "User"}</h1>
      <p>Email: {user.gmail || "No email provided"}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileNew;
