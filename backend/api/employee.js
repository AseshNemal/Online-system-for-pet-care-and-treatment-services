import { connect } from "../src/utils/database.connection.js";
import Employee from "../src/API/model/Employee.js";
import AppointmentData from "../src/API/model/AppointmentData.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "POST":
        if (path === "/api/employee/create") {
          const { firstName, lastName, username, email, password, role } = body;
          const employeeCount = await Employee.countDocuments();
          const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

          const employee = new Employee({
            employeeId,
            firstName,
            lastName,
            username,
            email,
            password,
            role,
            availability: []
          });

          await employee.save();
          const totalCount = await Employee.countDocuments();
          return res.status(201).json({ employee, totalCount });
        } else if (path === "/api/employee/login") {
          const { username, password } = body;
          if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
          }
          const employee = await Employee.findOne({ username });
          if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
          }
          if (employee.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
          }
          const { password: _, ...employeeData } = employee.toObject();
          return res.status(200).json({ message: "Login successful", user: employeeData });
        } else if (path === "/api/employee/appointment") {
          const { employeeId, petName, appointmentDate } = body;
          if (!employeeId || !petName || !appointmentDate) {
            return res.status(400).json({ error: "employeeId, petName, and appointmentDate are required" });
          }
          const employee = await Employee.findOne({ employeeId });
          if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
          }
          employee.appointments.push({
            petName,
            appointmentDate: new Date(appointmentDate),
          });
          await employee.save();
          return res.status(201).json({ message: "Appointment added successfully", employee });
        } else if (path === "/api/employee/receive-appointment-data") {
          const { employeeId, name, role, appointmentCount } = body;
          if (!employeeId || !name || !role || appointmentCount === undefined) {
            return res.status(400).json({ error: "employeeId, name, role, and appointmentCount are required" });
          }
          const appointmentData = await AppointmentData.findOneAndUpdate(
            { employeeId },
            { name, role, appointmentCount, createdAt: Date.now() },
            { upsert: true, new: true }
          );
          return res.status(201).json({ message: "Appointment data received successfully", appointmentData });
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "GET":
        if (path === "/api/employee/" || path === "/api/employee/get") {
          const employees = await Employee.find();
          const totalCount = employees.length;
          if (path === "/api/employee/get") {
            return res.status(200).json({ employees, totalCount });
          }
          return res.status(200).json(employees);
        } else if (path === "/api/employee/count") {
          const totalCount = await Employee.countDocuments();
          return res.status(200).json({ totalCount });
        } else if (path === "/api/employee/appointment-counts") {
          const employees = await Employee.find().select('employeeId firstName lastName role appointments');
          const appointmentCounts = employees.map(employee => ({
            employeeId: employee.employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role,
            totalAppointments: employee.appointments.length,
            appointments: employee.appointments
          }));
          appointmentCounts.sort((a, b) => b.totalAppointments - a.totalAppointments);
          return res.status(200).json(appointmentCounts);
        } else if (path === "/api/employee/sorted-appointment-data") {
          const appointmentData = await AppointmentData.find().sort({ appointmentCount: -1 });
          return res.status(200).json(appointmentData);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "PUT":
        if (path.startsWith("/api/employee/")) {
          const id = path.split("/").pop();
          const employee = await Employee.findById(id);
          if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
          }
          const { firstName, lastName, username, email, password, role } = body;
          if (password) {
            employee.password = password;
          }
          employee.firstName = firstName || employee.firstName;
          employee.lastName = lastName || employee.lastName;
          employee.username = username || employee.username;
          employee.email = email || employee.email;
          employee.role = role || employee.role;
          await employee.save();
          const totalCount = await Employee.countDocuments();
          return res.status(200).json({ employee, totalCount });
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      case "DELETE":
        if (path.startsWith("/api/employee/")) {
          const id = path.split("/").pop();
          const employee = await Employee.findByIdAndDelete(id);
          if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
          }
          const totalCount = await Employee.countDocuments();
          return res.status(200).json({ message: "Employee deleted", totalCount });
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
