const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee'); // Fixed the import syntax

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
            password, // Store the password as plain text
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
        // Find the employee by ID
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        // Check for password update
        if (password) {
            
            employee.password = password;
        }

        // Update employee details
        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.username = username || employee.username;
        employee.email = email || employee.email;
        employee.role = role || employee.role;

        // Save the updated employee
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
  
      // Sort by totalAppointments in descending order
      appointmentCounts.sort((a, b) => b.totalAppointments - a.totalAppointments);
  
      res.status(200).json(appointmentCounts);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });

module.exports = router;