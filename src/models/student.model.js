const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  phone: {
    type: String,
    unique: true,
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
  },
  facultyCard: {
    type: String,
    required: true,
    unique: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: [true, "Please provide faculty"],
  },
  favoritesDoctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
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

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
