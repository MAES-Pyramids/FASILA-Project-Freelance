const PurchaseModel = require("../models/purchase.model");

exports.checkStudentPurchasedLectures = async (studentId, lectureId) => {
  try {
    const data = await PurchaseModel.findOne({
      student: studentId,
      lecture: lectureId,
      status: "success",
    });

    if (!data) return { status: false, message: "Lecture not found" };
    else return { status: true, data };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getPLStatus = async (studentId, lectureId) => {
  try {
    const purchasedLecture = PurchaseModel.findOne({
      student: studentId,
      lecture: lectureId,
    });

    if (data?.transactionStatus === "success")
      return { status: false, message: "Lecture already purchased" };

    return { status: true, purchasedLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createNewPL = async (studentId, lectureId) => {
  try {
    const purchasedLecture = await PurchaseModel.create({
      student: studentId,
      lecture: lectureId,
    });
    return { status: true, purchasedLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
