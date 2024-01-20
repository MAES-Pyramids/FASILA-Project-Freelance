const SubjectModel = require("../models/subject.model");
const { isDoctorExist } = require("./doctor.service");

exports.getSubjects = async function (query, excluded = "") {
  try {
    const subjects = await SubjectModel.find(query).select(excluded);
    return { status: true, data: subjects };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getSubjectByID = async function (id, excluded = "") {
  try {
    const subject = await SubjectModel.findById(id)
      .select(excluded)
      .populate("doctors", "photo name PDFsNumber");
    if (!subject) return { status: false, message: "Subject Not Found" };
    else return { status: true, data: subject };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createSubject = async function (data) {
  try {
    const subject = await SubjectModel.create(data);
    return { status: true, data: subject };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.addDoctorToSubject = async function (subjectID, doctorID) {
  try {
    const isDoctor = await isDoctorExist(doctorID);
    if (!isDoctor) return { status: false, message: "Doctor Not Found" };

    const subject = await SubjectModel.findByIdAndUpdate(
      subjectID,
      { $push: { doctors: doctorID } },
      { new: true }
    );
    return { status: true, data: subject };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
exports.removeDoctorFromSubject = async function (subjectID, doctorID) {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      subjectID,
      { $pull: { doctors: doctorID } },
      { new: true }
    );
    return { status: true, data: subject };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
