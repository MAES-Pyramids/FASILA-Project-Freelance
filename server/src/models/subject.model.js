const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "subject_default.jpg",
  },
  semester: {
    type: Number,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: "Faculty",
    required: [true, "Please provide faculty"],
  },
  doctors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
    },
  ],
});
//-------------------------Export-----------------------//
const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
