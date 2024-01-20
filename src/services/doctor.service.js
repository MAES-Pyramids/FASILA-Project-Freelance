const DoctorModel = require("../models/doctor.model");

exports.getAllDoctors = async function (filter = {}) {
  try {
    const doctors = await DoctorModel.find(filter)
      .select("-password -__v")
      .populate("faculty", "name");
    return { status: true, data: doctors };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

exports.getDoctorByID = async function (id) {
  try {
    const doctor = await DoctorModel.findById(id)
      .select("-password -__v")
      .populate("faculty", "name");
    return { status: true, data: doctor };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

exports.isDoctorExist = async function (id) {
  try {
    const doctor = await DoctorModel.findById(id);
    if (!doctor) return false;
    return true;
  } catch (err) {
    return false;
  }
};
