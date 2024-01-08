const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: [true, "Please provide otp"],
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: [true, "Please provide user"],
  },
  OTPType: {
    type: String,
    enum: ["verify", "reset", "Force"],
    required: [true, "Please provide type"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 5 * 60 * 1000,
  },
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
