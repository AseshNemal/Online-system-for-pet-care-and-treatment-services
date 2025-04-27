const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee');
const AppointmentData = require('../model/AppointmentData');

// Generate unique employeeId
async function generateEmployeeId() {
    const prefix = 'EMP';
    const count = await Employee.countDocuments();
    return `${prefix}${count + 1}`; // e.g., EMP1, EMP2, etc.
}

// Create Employee
router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !username || !email || !password || !role) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const employeeId = await generateEmployeeId();

        const employee = new Employee({
            employeeId,
            firstName,
            lastName,
            username,
            email,
            password, // Plain text as per your request
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

// Get Employee Count
router.get('/count', async (req, res) => {
    try {
        const count = await Employee.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching employee count:', error);
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

// SECTION 1: Receiving Appointment Data from Scheduling Student
router.post('/receive-appointment-data', async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const { employeeId, name, role, appointmentCount } = req.body;

        if (!employeeId || !name || !role || appointmentCount === undefined) {
            return res.status(400).send({ error: "employeeId, name, role, and appointmentCount are required" });
        }

        const appointmentData = await AppointmentData.findOneAndUpdate(
            { employeeId },
            { name, role, appointmentCount, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        res.status(201).send({ message: "Appointment data received successfully", appointmentData });
    } catch (error) {
        console.error('Error saving appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

// SECTION 2: Provide Sorted Appointment Data
router.get('/sorted-appointment-data', async (req, res) => {
    try {
        const appointmentData = await AppointmentData.find().sort({ appointmentCount: -1 });
        res.status(200).json(appointmentData);
    } catch (error) {
        console.error('Error fetching sorted appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

// SECTION 3: Clear Appointment Data Before Uploading
router.delete('/sorted-appointment-data', async (req, res) => {
    try {
        console.log('Clearing AppointmentData collection');
        await AppointmentData.deleteMany({});
        res.status(200).send({ message: "Appointment data cleared successfully" });
    } catch (error) {
        console.error('Error clearing appointment data:', error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;