const {
  createDoctor,
  getAllDoctors,
  getDoctorByID,
  setDoctorPhoto,
} = require("../services/doctor.service");
const { s3UploadDocuments } = require("../services/digitalocean.service");
const { calculateLectureEarning } = require("../services/purchases.service");
const { getDoctorAllSubjects } = require("../services/subject.service");
const { getLecturesForDoctor } = require("../services/lecture.service");
const { isDoctorExist } = require("../services/doctor.service");
const mongoose = require("mongoose");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class DoctorController {
  /**
   * @description Get all doctors with ability to filter faculty
   * @route /api/v1/doctors
   * @method GET
   * @access private
   */
  static getDoctors = catchAsyncError(async (req, res, next) => {
    const { faculty } = req.query;
    const query = faculty != null ? { faculty } : {};

    const { status, data, message } = await getAllDoctors(query);
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get doctor by id
   * @route /api/v1/doctors/:id
   * @method GET
   * @access private
   */
  static getDoctorById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { status, data, message } = await getDoctorByID(id);
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Create a new doctor account by admin
   * @route /api/v1/doctors
   * @method Post
   * @access private
   */
  static addDoctor = catchAsyncError(async (req, res, next) => {
    let status, FileNames, data, message;
    const newDoctor = _.pick(req.body, [
      "name",
      "phone",
      "password",
      "faculty",
    ]);

    // we are gonna follow this technique cause in case we just created first, we won't be sure that doctor will pass validation which could lead to un used but stored images in s3
    const session = await mongoose.startSession({ validateBeforeSave: true });
    session.startTransaction();

    try {
      ({ status, data, message } = await createDoctor(newDoctor, session));
      if (!status) throw new Error(message);

      if (req.files) {
        ({ status, FileNames, message } = await s3UploadDocuments(
          req.files,
          "doctor"
        ));
        if (!status) throw new Error(message);

        ({ status, data, message } = await setDoctorPhoto(
          data,
          FileNames[0],
          session
        ));
        if (!status) throw new Error(message);
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      return next(new AppError(err.message, 500));
    }

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get doctor Current Earnings for each subject with each lecture specific return
   * @route /api/v1/doctors/:id/earnings
   * @method PUT
   * @access private
   */
  static getDoctorEarnings = catchAsyncError(async (req, res, next) => {
    let result = [];
    const { id } = req.params;
    let status, data, message;
    let TotalEarnings = 0;

    ({ status, data, message } = await isDoctorExist(id));
    if (!status) return next(new AppError(message, 404));
    const { earning } = data;

    ({ status, data, message } = await getDoctorAllSubjects(id));
    if (!status) return { status: false, message };

    for (const subject of data) {
      const { status, data, message } = await calculateSubjectEarnings(
        id,
        subject,
        earning
      );
      if (!status) return next(new AppError(message, 500));
      result.push(data);
      TotalEarnings += data.SubjectEarnings;
    }

    res.send({
      status: "success",
      data: {
        TotalEarnings,
        Subjects: result,
      },
    });
  });
}

const calculateSubjectEarnings = async (doctorId, subject, earning) => {
  try {
    let lectures = [];
    let SubjectEarnings = 0;

    const {
      status: lecturesStatus,
      data: lecturesData,
      message: lecturesMessage,
    } = await getLecturesForDoctor({
      doctor: doctorId,
      subject: subject._id,
    });

    if (!lecturesStatus) return { status: false, message: lecturesMessage };

    for (const lec of lecturesData) {
      const lastLectureDate = earning.get(subject._id)
        ? earning.get(subject._id).at(-1).date
        : 0;

      const { status, data, message } = await calculateLectureEarning(
        lec._id,
        lastLectureDate
      );
      if (!status) throw new Error(message);

      lectures.push({
        id: lec._id,
        name: lec.name,
        new_purchases: data.length,
        earning: lec.publishPrice * data.length,
      });
      SubjectEarnings += lec.publishPrice * data.length;
    }

    return {
      status: true,
      data: {
        subjectId: subject._id,
        subjectName: subject.name,
        subjectPhoto: subject.photo,
        SubjectEarnings,
        lectures,
      },
    };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

module.exports = {
  DoctorController,
  calculateSubjectEarnings,
};
