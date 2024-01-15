const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  PDFsNumber: {
    type: Map,
    of: Number,
    default: {},
  },
  earning: [
    {
      value: Number,
      date: Date,
    },
  ],
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: "Faculty",
    required: [true, "Please provide faculty"],
  },
});

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
