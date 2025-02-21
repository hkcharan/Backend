import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      trim: true, // Trims leading/trailing whitespace
    },

    email: {
      type: String,
      trim: true, // Trims leading/trailing whitespace
      unique: true, // Ensures email is unique
      match: [/.+\@.+\..+/, "Please enter a valid email address"], // Simple email validation
    },
    homeText: {
      type: String,
      trim: true, // Trims leading/trailing whitespace
    },
    aboutText: {
      type: String,
      trim: true, // Trims leading/trailing whitespace
    },
    password: {
      type: String,
      required: true,
      select: false, // Password is required
    },
    address: {
      type: String,
    },

    profileImage: {
      public_id: {
        type: String,
        required: true, // Image public_id is required
      },
      url: {
        type: String,
        required: true, // Image URL is required
      },
    },
    resumeURL: {
      type: String,
      trim: true,
    },

    projects: {
      type: Number,
    },
    experience: {
      type: Number,
    },
    words: { 
      type: [String], 
      default: [] 
  },


    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
