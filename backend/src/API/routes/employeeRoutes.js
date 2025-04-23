const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee');
const AppointmentData = require('../model/AppointmentData'); // Model for appointment data

// Create Employee
router.post('/create', async (req, res) => {
    try {
        const { employeeId, firstName, lastName, username, email, password, role } = req.body;

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
        res.status(201).send(employee);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retrieve All Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Employee Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const employee = await Employee.findOne({ username });

        if (!employee) {
            return res.status(404).send("User not found");
        }

        if (employee.password !== password) {
            return res.status(400).send("Invalid credentials");
        }

        res.status(200).json({ message: "Login successful", user: employee });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Delete Employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        res.status(200).send("Employee deleted");
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Update Employee
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        if (password) {
            employee.password = password;
        }

        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.username = username || employee.username;
        employee.email = email || employee.email;
        employee.role = role || employee.role;

        await employee.save();
        res.status(200).send(employee);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Add Appointment
router.post('/appointment', async (req, res) => {
    try {
        const { employeeId, petName, appointmentDate } = req.body;

        if (!employeeId || !petName || !appointmentDate) {
            return res.status(400).send({ error: "employeeId, petName, and appointmentDate are required" });
        }

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).send({ error: "Employee not found" });
        }

        employee.appointments.push({
            petName,
            appointmentDate: new Date(appointmentDate),
        });

        await employee.save();
        res.status(201).send({ message: "Appointment added successfully", employee });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get Appointment Counts per Employee
router.get('/appointment-counts', async (req, res) => {
    try {
        const employees = await Employee.find().select('employeeId firstName lastName role appointments');
        const appointmentCounts = employees.map(employee => ({
            employeeId: employee.employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role,
            totalAppointments: employee.appointments.length,
            appointments: employee.appointments
        }));

        appointmentCounts.sort((a, b) => b.totalAppointments - a.totalAppointments);
        res.status(200).json(appointmentCounts);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Receive appointment data from another student
router.post('/receive-appointment-data', async (req, res) => {
    try {
        const { employeeId, name, role, appointmentCount } = req.body;

        if (!employeeId || !name || !role || appointmentCount === undefined) {
            return res.status(400).send({ error: "employeeId, name, role, and appointmentCount are required" });
        }

        const appointmentData = new AppointmentData({
            employeeId,
            name,
            role,
            appointmentCount
        });

        await appointmentData.save();
        res.status(201).send({ message: "Appointment data received successfully", appointmentData });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get sorted appointment data
router.get('/sorted-appointment-data', async (req, res) => {
    try {
        const appointmentData = await AppointmentData.find().sort({ appointmentCount: -1 });
        res.status(200).json(appointmentData);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Clear appointment data (used before uploading sorted data)
router.delete('/sorted-appointment-data', async (req, res) => {
    try {
        await AppointmentData.deleteMany({});
        res.status(200).send({ message: "Appointment data cleared successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;