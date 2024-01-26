const PurchaseModel = require("../models/purchase.model");

exports.checkStudentLecture = async (studentId, lectureId) => {
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
