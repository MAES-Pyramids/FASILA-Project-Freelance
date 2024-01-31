const PLModel = require("../models/purchase.model");

exports.checkStudentPurchasedLectures = async (studentId, lectureId) => {
  try {
    const data = await PLModel.findOne({
      student: studentId,
      lecture: lectureId,
      status: "success",
    });

    const FormattedData = {
      _id: data._id,
      name: data.lecture.name,
      description: data.lecture.description,
      no_purchases: data.lecture.no_purchases,
      no_slides: data.lecture.no_slides,
      preview_path: data.lecture.preview_path,
      createdAt: data.createdAt,
      path: data.path,
    };

    if (!data) return { status: false };
    else return { status: true, data: FormattedData };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isLecturePurchased = async (student, lecture) => {
  try {
    const PLecture = await PLModel.findOne({ student, lecture });

    if (PLecture)
      return { status: false, message: "Lecture already purchased" };

    return { status: true };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createNewPL = async (student, lecture, price = 0, others) => {
  try {
    const PLecture = await PLModel.create({
      student,
      lecture,
      price,
      ...others,
    });
    return { status: true, PLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
