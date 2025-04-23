const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee');
const AppointmentData = require('../model/AppointmentData');

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
            password, // Plain text as per your request (April 22, 2025)
            role,
            availability: []
        });

        await employee.save();
        res.status(201).send(employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).send({ error: error.message });
    }
});

// Retrieve All Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
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
        console.error('Error logging in:', error);
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
        console.error('Error deleting employee:', error);
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
        console.error('Error updating employee:', error);
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
        console.error('Error adding appointment:', error);
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
        console.error('Error fetching appointment counts:', error);
        res.status(400).send({ error: error.message });
    }
});

// SECTION 1: RECEIVING APPOINTMENT DATA FROM APPOINTMENT SCHEDULING STUDENT
// This endpoint is called by the appointment scheduling student to send appointment data
// (employeeId, name, role, appointmentCount). The data is stored in the AppointmentData
// collection in MongoDB. Uses findOneAndUpdate to update existing records or create new ones
// to avoid duplicate key errors.
router.post('/receive-appointment-data', async (req, res) => {
    try {
        console.log('Received data:', req.body); // Log incoming data for debugging
        const { employeeId, name, role, appointmentCount } = req.body;

        // Validate required fields
        if (!employeeId || !name || !role || appointmentCount === undefined) {
            return res.status(400).send({ error: "employeeId, name, role, and appointmentCount are required" });
        }

        // Update existing record or create new one
        const appointmentData = await AppointmentData.findOneAndUpdate(
            { employeeId }, // Find by employeeId
            { name, role, appointmentCount, createdAt: Date.now() }, // Update fields
            { upsert: true, new: true } // Create if not exists, return updated document
        );

        res.status(201).send({ message: "Appointment data received successfully", appointmentData });
    } catch (error) {
        console.error('Error saving appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

// SECTION 2: PROVIDING SORTED APPOINTMENT DATA FOR FINANCE MANAGEMENT STUDENT
// This endpoint allows the finance management student to retrieve the sorted appointment
// data (by appointmentCount, descending) after you sort and upload it via the Dashboard.
// Returns all records from the AppointmentData collection, sorted by appointmentCount.
router.get('/sorted-appointment-data', async (req, res) => {
    try {
        const appointmentData = await AppointmentData.find().sort({ appointmentCount: -1 });
        res.status(200).json(appointmentData);
    } catch (error) {
        console.error('Error fetching sorted appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

// SECTION 3: CLEARING APPOINTMENT DATA BEFORE UPLOADING SORTED DATA
// This endpoint clears the AppointmentData collection before uploading sorted data
// to ensure a clean, sorted dataset for the finance management student.
router.delete('/sorted-appointment-data', async (req, res) => {
    try {
        console.log('Clearing AppointmentData collection'); // Log for debugging
        await AppointmentData.deleteMany({});
        res.status(200).send({ message: "Appointment data cleared successfully" });
    } catch (error) {
        console.error('Error clearing appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;