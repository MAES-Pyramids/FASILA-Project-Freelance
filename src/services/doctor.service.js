const DoctorModel = require("../models/doctor.model");
const { isFacultyExist } = require("./faculty.service");

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

exports.createDoctor = async function (data) {
  try {
    const isFaculty = await isFacultyExist(data.faculty);
    if (!isFaculty) return { status: false, data: "Faculty Not Found" };

    const doctor = await DoctorModel.create(data);
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
