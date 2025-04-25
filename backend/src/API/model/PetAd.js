const mongoose = require("mongoose");

const PetAdSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Base64 string
  type: {
    type: String,
    enum: ["Dog", "Cat", "Goat", "Cow", "Bird", "Squirrel", "Other"],
    required: true,
  },
  breed: { type: String, required: true },
  weight: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, maxlength: 500 },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Deleted"],
    default: "Pending",
  },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PetAdSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("PetAd", PetAdSchema);