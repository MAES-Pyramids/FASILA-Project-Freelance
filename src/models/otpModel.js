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
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 5,
  },
});
