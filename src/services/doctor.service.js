const { isFacultyExist } = require("./faculty.service");
const DoctorModel = require("../models/doctor.model");
const _ = require("lodash");

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

exports.createDoctor = async function (newDoctor, session) {
  try {
    const isFaculty = await isFacultyExist(newDoctor.faculty);
    if (!isFaculty) return { status: false, message: "Faculty Not Found" };

    let doctor = new DoctorModel(newDoctor);
    doctor = await doctor.save({ session });

    return { status: true, data: doctor };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.setDoctorPhoto = async function (doctor, photo, session) {
  try {
    doctor.photo = photo;
    const updatedDoctor = await doctor.save({ session });

    const doctorData = _.omit(updatedDoctor.toObject(), ["password", "__v"]);
    return { status: true, data: doctorData };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isDoctorExist = async function (id, faculty = "") {
  try {
    const doctor = await DoctorModel.findById(id);
    if (!doctor) return { status: false, message: "Doctor Not Found" };

    if (faculty && doctor.faculty.toJSON() !== faculty.toJSON())
      return {
        status: false,
        message: "Doctor and subject aren't on same faculty",
      };

    return { status: true, data: doctor };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.addSubjectId = async function (doctorId, subjectId, session) {
  try {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) return { status: false, message: "Doctor Not Found" };

    if (doctor.earning.hasOwnProperty(subjectId)) {
      return { status: true, message: "Doctor already added" };
    }

    doctor.earning.set(subjectId, {
      value: 0,
      date: new Date(),
    });
    await doctor.save({ session });

    return { status: true, message: "Doctor added successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getDoctorsNumber = async function (query) {
  try {
    const doctorsNumber = await DoctorModel.countDocuments(query);
    return { status: true, data: doctorsNumber };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
