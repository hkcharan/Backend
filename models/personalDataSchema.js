import mongoose from "mongoose";

const personalDataSchema = new mongoose.Schema({
    content: { type: String, required: true }, 
    updatedAt: { type: Date, default: Date.now },
});

export const PersonalData =  mongoose.model("PersonalData", personalDataSchema);