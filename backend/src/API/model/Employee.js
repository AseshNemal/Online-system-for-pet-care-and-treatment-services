const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
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
        required: true
    },
    availability: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Available', 'Booked'],
            default: 'Available'
        }
    }],
    appointments: [{
        petName: {
            type: String,
            required: true
        },
        appointmentDate: {
            type: Date,
            required: true
        }
    }]
});

module.exports = mongoose.model('Employee', employeeSchema);