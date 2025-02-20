const mongoose = require("mongoose");
const OTP_TTL = process.env.OTP_TTL || 8;
const OTPSchema = new mongoose.Schema({
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
    enum: ["verify", "reset", "force", "telegram"],
    required: [true, "Please provide type"],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + OTP_TTL * 60 * 1000,
  },
});
//-------------------------Export-----------------------//
const Otp = mongoose.model("Otp", OTPSchema);
module.exports = Otp;
