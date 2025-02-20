const PLModel = require("../models/purchase.model");

exports.checkStudentPurchasedLectures = async (studentId, lectureId) => {
  try {
    const data = await PLModel.findOne({
      student: studentId,
      lecture: lectureId,
      status: "success",
    });
    if (!data) return { status: false };

    const FormattedData = {
      _id: data._id,
      name: data.lecture.name,
      description: data.lecture.description,
      no_purchases: data.no_purchases,
      no_slides: data.lecture.no_slides,
      preview_path: data.lecture.preview_path,
      createdAt: data.createdAt,
    };

    return { status: true, data: FormattedData };
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

exports.isPurchasedLectureAllowed = async (studentId, PLlectureId) => {
  try {
    const PLecture = await PLModel.findById(PLlectureId);
    if (!PLecture) return { status: false, message: "Lecture not found" };

    if (PLecture.student.toString() !== studentId) {
      return {
        status: false,
        message: "You are not allowed to access this lecture",
      };
    }

    return { status: true, data: PLecture };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createNewPL = async (PLectureData, price, session) => {
  try {
    const PLecture = new PLModel({ ...PLectureData, price });
    await PLecture.save({ session });

    return { status: true, message: "Lecture purchased successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.updatePLectureKey = async (PLectureId, key) => {
  try {
    await PLModel.findByIdAndUpdate(PLectureId, { key });
    return { status: true, message: "Key updated successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.updatePLectureUpdatesFileKey = async (PLectureId, key) => {
  try {
    await PLModel.findByIdAndUpdate(PLectureId, { updatesFileKey: key });
    return { status: true, message: "Key updated successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.calculateLectureEarning = async (lectureId, createdAfter) => {
  try {
    const data = await PLModel.aggregate([
      {
        $match: {
          lecture: lectureId,
          status: "success",
          purchasedAt: { $gte: new Date(`${createdAfter}`) },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    return { status: true, data: data };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getPLecturePath = async (PLectureId) => {
  try {
    const PLecture = await PLModel.findById(PLectureId);

    return {
      status: true,
      data: {
        path: PLecture.path,
        updatesFilePath: PLecture.updatesFilePath,
        password: PLecture.password,
      },
    };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
