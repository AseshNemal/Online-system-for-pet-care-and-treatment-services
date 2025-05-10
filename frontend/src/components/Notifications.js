import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

// Paw icon SVG component for reuse
const PawIcon = ({ size = 80, color = "#4263eb", opacity = 0.03, style = {} }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    width={size} 
    height={size} 
    style={{ ...style, opacity }}
  >
    <path 
      fill={color} 
      d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z"
    />
  </svg>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // First get the authenticated user
      const sessionRes = await fetch(`${process.env.REACT_APP_API_URL}/get-session`, { 
        credentials: 'include' 
      });
      const sessionData = await sessionRes.json();
      
      if (!sessionData.user?._id) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const userId = sessionData.user._id;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/user/${userId}`, { 
        withCredentials: true 
      });
      
      setNotifications(response.data);
      const unread = response.data.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications.');
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/mark-read`, {}, {
        withCredentials: true
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const sessionRes = await fetch(`${process.env.REACT_APP_API_URL}/get-session`, { 
        credentials: 'include' 
      });
      const sessionData = await sessionRes.json();
      
      if (!sessionData.user?._id) {
        return;
      }

      const userId = sessionData.user._id;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/user/${userId}/mark-all-read`, {}, {
        withCredentials: true
      });
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  // Relative time formatter (e.g., "2 hours ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMilliseconds = now - date;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 7) {
      return formatDateTime(dateString);
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-loading">
          Loading notifications...
          <div className="loading-paws">
            {[...Array(3)].map((_, i) => (
              <PawIcon 
                key={i} 
                size={40} 
                opacity={0.2 - (i * 0.05)} 
                style={{ 
                  margin: '10px',
                  animation: `pulse 1s ease ${i * 0.3}s infinite` 
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="notifications-error">{error}</div>;
  }

  return (
    <div className="notifications-container">
      {/* Background paw prints */}
      <div className="paw-background">
        {[...Array(6)].map((_, index) => (
          <PawIcon 
            key={index}
            size={80 + Math.random() * 40}
            color="#4263eb"
            opacity={0.03 + Math.random() * 0.02}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              zIndex: 0
            }}
          />
        ))}
      </div>
      
      <div className="notifications-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-btn" 
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="notification-icon">
                {!notification.read && <span className="unread-indicator"></span>}
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{getRelativeTime(notification.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 