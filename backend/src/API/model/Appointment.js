/* model/Appointment.js */
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  petOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // groomer or veterinarian
  petName: { type: String, required: true },
  serviceCategory: {
    type: String,
    required: true,
    enum: ["Bath", "Bath + Haircut", "Nail Trimming", "Haircut", "Regular Check-up", "Vaccination", "Dental"]
  },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true }, // e.g. "14:30"
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;

