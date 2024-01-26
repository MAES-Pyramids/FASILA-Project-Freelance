const lectureModel = require("../models/lecture.model");
const { checkSubjectDoctor } = require("./subject.service");
const { checkStudentPurchasedLectures } = require("./purchases.service");

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

exports.getLecturesForStudent = async (query, student) => {
  try {
    excluded =
      "-subject -doctor -type -publishedBy -publishPrice -confirmed -finalLayout -__v -path";

    let AllLectures = await lectureModel.find(query).select(excluded);
    AllLectures = await Promise.all(
      AllLectures.map(async (lec) => {
        const { status, data } = await checkStudentPurchasedLectures(
          student,
          lec._id
        );
        if (status) return { ...data.toObject(), purchased: true };
        else return { ...lec.toObject(), purchased: false };
      })
    );

    return { status: true, data: AllLectures };
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

exports.checkLectureStatus = async (lectureId) => {
  try {
    const lecture = await lectureModel.findOne({ _id: lectureId });
    if (!lecture) return { status: false, message: "Lecture not found" };

    return { status: lecture.confirmed, lecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getLecturePaymentData = (lecture) => {
  return {
    amount: lecture.finalPrice * 100,
    item: {
      name: lecture.name,
      amount_cents: lecture.finalPrice * 100,
      description: lecture.description,
      quantity: 1,
    },
  };
};

exports.deleteLecture = async (lectureId) => {};
