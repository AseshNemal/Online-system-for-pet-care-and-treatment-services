const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  petId: {
    type: String, // Using String instead of ObjectId for simplicity
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  visitType: String,
  veterinarian: String,
  diagnosis: String,
  treatment: String,
  medications: [{
    name: String,
    dosage: String
  }],
  notes: String,
  followUpDate: Date
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);