const lectureModel = require("../models/lecture.model");
const { checkSubjectDoctor } = require("./subject.service");

exports.getLectures = async (query, excluded, populateFlag) => {
  try {
    let DBquery = lectureModel.find(query).select(excluded);

    const data = await (populateFlag
      ? DBquery.populate("publishedBy doctor subject", "name")
      : DBquery);

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
