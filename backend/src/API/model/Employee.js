const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['Vet', 'Groomer', 'Admin'] },
    availability: [{ date: String, timeSlots: [String], approved: Boolean }]
});

module.exports = mongoose.model('Employee', EmployeeSchema);