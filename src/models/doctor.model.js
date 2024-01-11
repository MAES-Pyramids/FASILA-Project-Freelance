const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({});

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
