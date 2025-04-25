/* routes/appointment.routes.js */
import express from "express";
import Appointment from "../model/Appointment.js";
import { authenticate } from "../middleware/auth.middlewere.js";

const router = express.Router();

// Validation helper
const isValidAppointmentDate = (date) => {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setMonth(now.getMonth() + 60);
  return date >= now && date <= maxDate;
};

// 📌 Create Appointment
router.post("/", authenticate, async (req, res) => {
  try {
    console.log("🔥 Incoming appointment request");
    console.log("🔐 User from session:", req.user);
    console.log("📦 Request body:", req.body);

    const { staffId, petName, serviceCategory, appointmentDate, appointmentTime } = req.body;

    if (!req.user || !req.user._id) {
      console.error("❌ Authentication error: No user in session");
      return res.status(401).json({ error: "User not authenticated." });
    }

    const petOwnerId = req.user._id;

    if (!staffId || !petName || !serviceCategory || !appointmentDate || !appointmentTime) {
      console.error("❌ Validation error: Missing required fields");
      return res.status(400).json({ error: "All fields are required." });
    }

    // Convert date string to Date object
    const apptDate = new Date(appointmentDate);
    if (isNaN(apptDate.getTime())) {
      console.error("❌ Invalid date format:", appointmentDate);
      return res.status(400).json({ error: "Invalid appointment date format." });
    }

    if (!isValidAppointmentDate(apptDate)) {
      console.error("❌ Date validation error: Date out of range");
      return res.status(400).json({ error: "Appointment date must be from today up to 60 months in the future." });
    }

    const newAppointment = new Appointment({
      petOwnerId,
      staffId,
      petName,
      serviceCategory,
      appointmentDate: apptDate,
      appointmentTime
    });

    await newAppointment.save();
    console.log("✅ Appointment saved:", newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("❌ Appointment creation error:", err); // full stack
    res.status(500).json({ error: "Failed to create appointment", details: err.message });
  }
});

// 📌 Get appointments for a user
router.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({
      $or: [{ petOwnerId: userId }, { staffId: userId }]
    }).sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});

// 📌 Update appointment
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate } = req.body;

    if (appointmentDate) {
      const apptDate = new Date(appointmentDate);
      if (!isValidAppointmentDate(apptDate)) {
        return res.status(400).json({ error: "Appointment date must be within 60 months from today." });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment." });
  }
});

// 📌 Delete appointment
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    res.json({ message: "Appointment deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment." });
  }
});

export default router;
