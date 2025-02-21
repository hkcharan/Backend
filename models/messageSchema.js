import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
    trim: true, // Trim whitespace
  },
  email: {
    type: String,
    required: true, // Email is required
    trim: true, // Trim whitespace
    match: [/.+\@.+\..+/, "Please enter a valid email address"], // Simple email validation
  },
  message: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export const Message = mongoose.model("Message", messageSchema);
