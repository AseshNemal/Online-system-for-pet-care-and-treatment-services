import { connect } from "../src/utils/database.connection.js";
import Appointment from "../src/API/model/Appointment.js";
// Note: Authentication middleware needs to be adapted for serverless environment

export default async function handler(req, res) {
  await connect();

  const { method, query, body, url } = req;

  // Simple path parsing for subroutes
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "POST":
        if (path === "/api/appointment/") {
          // TODO: Implement authentication check for req.user in serverless
          const { employeeId, employeeFirstName, employeeRole, petName, serviceCategory, appointmentDate, appointmentTime } = body;

          if (!employeeId || !employeeFirstName || !employeeRole || !petName || !serviceCategory || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ error: "All fields are required." });
          }

          const apptDate = new Date(appointmentDate);
          if (isNaN(apptDate.getTime())) {
            return res.status(400).json({ error: "Invalid appointment date format." });
          }

          // Validation for appointment date range omitted for brevity

          const newAppointment = new Appointment({
            employeeId,
            employeeFirstName,
            employeeRole,
            petName,
            serviceCategory,
            appointmentDate: apptDate,
            appointmentTime
          });

          await newAppointment.save();
          return res.status(201).json(newAppointment);
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "GET":
        if (path.startsWith("/api/appointment/user/")) {
          const userId = path.split("/").pop();
          const appointments = await Appointment.find({
            $or: [{ petOwnerId: userId }, { employeeId: userId }]
          }).sort({ appointmentDate: 1 });
          return res.status(200).json(appointments);
        } else if (path === "/api/appointment/available-slots") {
          const { employeeId, date, serviceCategory } = query;
          if (!employeeId || !date || !serviceCategory) {
            return res.status(400).json({ error: "Missing required query parameters." });
          }

          const sessionLengthMinutes = (serviceCategory === "Bath + Haircut") ? 45 : 30;
          const openingHour = 8;
          const closingHour = 22;
          const slots = [];
          const dateObj = new Date(date);
          dateObj.setHours(openingHour, 0, 0, 0);

          while (dateObj.getHours() < closingHour) {
            const timeStr = dateObj.toTimeString().slice(0, 5);
            slots.push(timeStr);
            dateObj.setMinutes(dateObj.getMinutes() + sessionLengthMinutes);
          }

          const appointments = await Appointment.find({
            employeeId,
            appointmentDate: new Date(date),
          });

          const bookedTimes = appointments.map(app => app.appointmentTime);
          const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

          return res.status(200).json({ availableSlots });
        } else if (path === "/api/appointment/all") {
          const appointments = await Appointment.find({}).sort({ appointmentDate: 1 });
          return res.status(200).json(appointments);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "PUT":
        if (path.startsWith("/api/appointment/")) {
          const id = path.split("/").pop();
          const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { ...body, updatedAt: new Date() },
            { new: true }
          );
          if (!updatedAppointment) {
            return res.status(404).json({ error: "Appointment not found." });
          }
          return res.status(200).json(updatedAppointment);
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      case "DELETE":
        if (path.startsWith("/api/appointment/")) {
          const id = path.split("/").pop();
          const deletedAppointment = await Appointment.findByIdAndDelete(id);
          if (!deletedAppointment) {
            return res.status(404).json({ error: "Appointment not found." });
          }
          return res.status(200).json({ message: "Appointment deleted successfully." });
        }
        return res.status(400).json({ error: "Invalid DELETE request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
