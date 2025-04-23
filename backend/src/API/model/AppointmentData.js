const mongoose = require('mongoose');

// Schema for storing appointment data received from the appointment scheduling student
const appointmentDataSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true // Ensures unique employeeId, handled by findOneAndUpdate
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    appointmentCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AppointmentData', appointmentDataSchema);