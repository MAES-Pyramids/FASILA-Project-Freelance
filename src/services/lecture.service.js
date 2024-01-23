const lectureModel = require("../models/lecture.model");
const { checkSubjectDoctor } = require("./subject.service");

exports.getLectures = async (query, excluded) => {
  try {
    const data = await lectureModel.find(query).select(excluded);
    return { status: true, data };
  } catch (error) {
    return { status: false, message: error.message };
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
