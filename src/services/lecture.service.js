const lectureModel = require("../models/lecture.model");
const { checkSubjectDoctor } = require("./subject.service");

exports.getLecturesForAdmin = async (query) => {
  try {
    excluded = "-finalLayout  -__v";

    const data = await lectureModel
      .find(query)
      .select(excluded)
      .populate("publishedBy doctor subject", "name");

    return { status: true, data };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

exports.getLecturesForDoctor = async (query) => {
  try {
    excluded = "-finalLayout -type -publishedBy -doctor -subject -__v";
    const data = await lectureModel.find(query).select(excluded);

    return { status: true, data };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

exports.getLecturesForStudent = async (query) => {
  try {
    excluded =
      "-subject -doctor -type -publishedBy -publishPrice -confirmed -finalLayout -__v -path";

    let data = await lectureModel.find(query).select(excluded);
    return { status: true, data };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

exports.getLecture = async (_id) => {
  try {
    const STExcluded =
      "-subject -doctor -type -publishedBy -publishPrice -confirmed -finalLayout -__v";

    const lecture = await lectureModel
      .findOne({ _id, confirmed: true })
      .select(STExcluded);

    if (!lecture) return { status: false, message: "Lecture not found" };
    else return { status: true, data: lecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.uploadLecture = async (lecture) => {
  try {
    const { subject, doctor } = lecture;

    const { status, message } = await checkSubjectDoctor(subject, doctor);
    if (!status) return { status: false, message };

    lecture = await lectureModel.create(lecture);
    return { status: true, data: lecture };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

exports.confirmLectureService = async (lectureId, ConfirmBody) => {
  try {
    const body = { ...ConfirmBody, confirmed: true };
    const lecture = await lectureModel.findOne({
      _id: lectureId,
      confirmed: false,
    });
    if (!lecture) return { status: false, message: "Lecture not found" };

    lecture.set(body);
    await lecture.save();

    return { status: true, data: lecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.deleteLecture = async (lectureId) => {};
