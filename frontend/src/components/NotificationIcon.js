import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function NotificationIcon() {
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    // Fetch notifications count from backend
    const fetchNotificationCount = async () => {
      try {
        // First get the authenticated user
        const sessionRes = await fetch('https://online-system-for-pet-care-and-treatment.onrender.com/get-session', { 
          credentials: 'include' 
        });
        const sessionData = await sessionRes.json();
        
        if (!sessionData.user?._id) {
          return;
        }

        const userId = sessionData.user._id;
        const response = await axios.get(`https://online-system-for-pet-care-and-treatment.onrender.com/api/notifications/user/${userId}/unread-count`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          setNotificationCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };
    
    fetchNotificationCount();
    
    // Optional: Set up polling for real-time updates
    const intervalId = setInterval(fetchNotificationCount, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="notification-icon position-relative mx-3">
      <Link to="/notifications" className="text-dark">
        <i className="fas fa-bell"></i>
        {notificationCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notificationCount > 99 ? '99+' : notificationCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </Link>
    </div>
  );
}

export default NotificationIcon; 