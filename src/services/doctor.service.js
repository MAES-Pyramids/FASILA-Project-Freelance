const DoctorModel = require("../models/doctor.model");
const { isFacultyExist } = require("./faculty.service");

exports.getAllDoctors = async function (filter = {}) {
  try {
    const doctors = await DoctorModel.find(filter)
      .select("-password -__v")
      .populate("faculty", "name");
    return { status: true, data: doctors };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getDoctorByID = async function (id) {
  try {
    const doctor = await DoctorModel.findById(id)
      .select("-password -__v")
      .populate("faculty", "name");
    if (!doctor) return { status: false, message: "Doctor Not Found" };
    else return { status: true, data: doctor };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createDoctor = async function (newDoctor) {
  try {
    const isFaculty = await isFacultyExist(newDoctor.faculty);
    if (!isFaculty) return { status: false, message: "Faculty Not Found" };

    const doctor = await DoctorModel.create(newDoctor);
    return { status: true, data: doctor };
  } catch (err) {
    return { status: false, message: err.message };
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
