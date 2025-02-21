import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
