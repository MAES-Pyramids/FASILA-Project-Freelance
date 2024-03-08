const SubjectModel = require("../models/subject.model");
const { isDoctorExist } = require("./doctor.service");

exports.getSubjects = async function (query, excluded = "") {
  try {
    query = query._id
      ? (query = {
          faculty: query.faculty,
          doctors: { $in: [query._id] },
        })
      : query;

    const subjects = await SubjectModel.find(query).select(excluded);
    return { status: true, data: subjects };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getDoctorAllSubjects = async function (doctorID) {
  try {
    const subjects = await SubjectModel.find({ doctors: { $in: [doctorID] } });
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

exports.addDoctorToSubject = async function (subjectID, doctorID, session) {
  try {
    const subject = await SubjectModel.findById(subjectID);

    const { status, message } = await isDoctorExist(doctorID, subject.faculty);
    if (!status) return { status: false, message };

    if (subject.doctors.includes(doctorID))
      return { status: false, message: "Doctor already added" };

    subject.doctors.push(doctorID);
    await subject.save({ session });

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

exports.checkSubjectDoctor = async function (subjectID, doctorID) {
  const subject = await SubjectModel.findById(subjectID);
  if (!subject) return { status: false, message: "Subject Not Found" };

  if (!subject.doctors.includes(doctorID))
    return {
      status: false,
      message:
        "The doctor does not have permission to upload lectures for this subject",
    };

  return { status: true, message: "Doctor Found" };
};
