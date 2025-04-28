import express from 'express';
import Notification from '../model/Notification.js';
import Appointment from '../model/Appointment.js';
import User from '../model/user.model.js';

const router = express.Router();

// Get all notifications for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own notifications
    if (req.user && req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to notifications' });
    }
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to most recent 50 notifications
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark a notification as read
router.put('/:notificationId/mark-read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Check if the authenticated user owns this notification
    if (req.user && req.user._id.toString() !== notification.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to notification' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read for a user
router.put('/user/:userId/mark-all-read', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own notifications
    if (req.user && req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to notifications' });
    }
    
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Create a notification for an appointment
router.post('/appointment', async (req, res) => {
  try {
    const { appointmentId, userId, title, message } = req.body;
    
    if (!appointmentId || !userId || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newNotification = new Notification({
      userId,
      appointmentId,
      title,
      message,
      type: 'appointment',
      read: false
    });
    
    await newNotification.save();
    
    res.status(201).json({ message: 'Notification created', notification: newNotification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get unread notifications count for a user
router.get('/user/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own data
    if (req.user && req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to notifications' });
    }
    
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Create appointment booking notification
router.post('/appointment-booking', async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    // Find the appointment with populated user and employee data
    const appointment = await Appointment.findById(appointmentId)
      .populate('userId', 'firstName lastName email')
      .populate('employeeId', 'firstName lastName role');
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Format appointment date and time for the notification
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Create notification for the pet owner
    const ownerNotification = new Notification({
      userId: appointment.userId._id,
      appointmentId: appointment._id,
      title: 'Appointment Confirmed',
      message: `Your appointment for ${appointment.petName} with ${appointment.employeeId.firstName} ${appointment.employeeId.lastName} (${appointment.employeeId.role}) has been confirmed for ${formattedDate} at ${formattedTime}.`,
      type: 'appointment',
      read: false
    });
    
    await ownerNotification.save();
    
    res.status(201).json({ 
      message: 'Appointment notification created', 
      notification: ownerNotification 
    });
  } catch (error) {
    console.error('Error creating appointment notification:', error);
    res.status(500).json({ error: 'Failed to create appointment notification' });
  }
});

export default router; 