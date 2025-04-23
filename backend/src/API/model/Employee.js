const mongoose = require('mongoose');

// Define the Employee Schema
const EmployeeSchema = new mongoose.Schema({
    employeeId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Vet', 'Groomer'], 
        required: true 
    },
    availability: [{ type: String }],
    appointments: [{
      petName: { type: String, required: true },
      appointmentDate: { type: Date, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
