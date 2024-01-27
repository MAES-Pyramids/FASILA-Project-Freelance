const PLModel = require("../models/purchase.model");

exports.checkStudentPurchasedLectures = async (studentId, lectureId) => {
  try {
    const data = await PLModel.findOne({
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
    const PLecture = await PLModel.findOne({
      student: studentId,
      lecture: lectureId,
    });

    if (PLecture?.transactionStatus === "success")
      return { status: false, message: "Lecture already purchased" };

    if (!PLecture) return { status: true, checker: { existing: false } };

    if (PLecture?.orderId) {
      return {
        status: true,
        checker: { existing: true, orderCreated: true },
        PLecture,
      };
    } else {
      return {
        status: true,
        checker: { existing: true, orderCreated: false },
        PLecture,
      };
    }
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createNewPL = async (studentId, lectureId) => {
  try {
    const PLecture = await PLModel.create({
      student: studentId,
      lecture: lectureId,
    });
    return { status: true, PLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.storeOrderId = async (_id, orderId) => {
  try {
    const PLecture = await PLModel.findByIdAndUpdate(
      _id,
      { orderId },
      { new: true }
    );

    if (!PLecture) return { status: false, message: "Order not found" };
    else return { status: true, PLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
