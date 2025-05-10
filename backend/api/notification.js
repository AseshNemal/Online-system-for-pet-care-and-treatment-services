import { connect } from "../src/utils/database.connection.js";
import Notification from "../src/API/model/Notification.js";
import Appointment from "../src/API/model/Appointment.js";
import User from "../src/API/model/user.model.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "GET":
        if (path.startsWith("/api/notification/user/") && !path.endsWith("/unread-count")) {
          const userId = path.split("/")[3];
          // Authentication check omitted for serverless
          const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);
          return res.status(200).json(notifications);
        } else if (path.startsWith("/api/notification/user/") && path.endsWith("/unread-count")) {
          const userId = path.split("/")[3];
          // Authentication check omitted for serverless
          const count = await Notification.countDocuments({ userId, read: false });
          return res.status(200).json({ count });
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "PUT":
        if (path.endsWith("/mark-read")) {
          const notificationId = path.split("/")[2];
          const notification = await Notification.findById(notificationId);
          if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
          }
          // Authentication check omitted for serverless
          notification.read = true;
          await notification.save();
          return res.status(200).json({ message: "Notification marked as read" });
        } else if (path.endsWith("/mark-all-read")) {
          const userId = path.split("/")[3];
          // Authentication check omitted for serverless
          await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
          return res.status(200).json({ message: "All notifications marked as read" });
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      case "POST":
        if (path === "/api/notification/appointment") {
          const { appointmentId, userId, title, message } = body;
          if (!appointmentId || !userId || !title || !message) {
            return res.status(400).json({ error: "Missing required fields" });
          }
          const newNotification = new Notification({
            userId,
            appointmentId,
            title,
            message,
            type: "appointment",
            read: false,
          });
          await newNotification.save();
          return res.status(201).json({ message: "Notification created", notification: newNotification });
        } else if (path === "/api/notification/appointment-booking") {
          const { appointmentId } = body;
          if (!appointmentId) {
            return res.status(400).json({ error: "Appointment ID is required" });
          }
          const appointment = await Appointment.findById(appointmentId)
            .populate("userId", "firstName lastName email")
            .populate("employeeId", "firstName lastName role");
          if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
          }
          const appointmentDate = new Date(appointment.date);
          const formattedDate = appointmentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const ownerNotification = new Notification({
            userId: appointment.userId._id,
            appointmentId: appointment._id,
            title: "Appointment Confirmed",
            message: `Your appointment for ${appointment.petName} with ${appointment.employeeId.firstName} ${appointment.employeeId.lastName} (${appointment.employeeId.role}) has been confirmed for ${formattedDate} at ${formattedTime}.`,
            type: "appointment",
            read: false,
          });
          await ownerNotification.save();
          return res.status(201).json({ message: "Appointment notification created", notification: ownerNotification });
        }
        return res.status(400).json({ error: "Invalid POST request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
