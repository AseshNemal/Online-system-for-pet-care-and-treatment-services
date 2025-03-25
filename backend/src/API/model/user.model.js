import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    image: { type: String },
    firstName: { type: String },
    lastName: { type: String },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
