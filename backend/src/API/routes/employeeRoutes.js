const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');


// Create Employee
router.post('/create', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Retrieve Employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.status(200).send(employee);
    } catch (error) {
        res.status(404).send("Employee not found");
    }
});

// Delete Employee
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).send("Employee deleted");
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update Availability
router.put('/availability/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        employee.availability = req.body.availability;
        await employee.save();
        res.status(200).send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Approve Availability (Admin)
router.put('/approve/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        employee.availability.forEach(slot => slot.approved = true);
        await employee.save();
        res.status(200).send("Schedule Approved");
    } catch (error) {
        res.status(400).send(error);
    }
});