const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  phone: {
    type: String,
    required: [true, "Please provide phone"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Please provide gender"],
  },
  semester: {
    type: Number,
    required: [true, "Please provide semester"],
  },
  telegramId: {
    type: String,
    required: [true, "Please provide telegramId"],
  },
  facultyCard: {
    path: {
      type: String,
      required: true,
    },
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wallet",
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "faculty",
  },
  favoritesDoctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  ],
  active: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Student", studentSchema);
