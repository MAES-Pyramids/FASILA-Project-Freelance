const {
  getStudents,
  setStudentFC,
  getStudentID,
  addFavDoctor,
  getFavDoctors,
  changePassword,
  removeFavDoctor,
  checkValidPhone,
  storeTelegramID,
  verifyTelegramID,
  updateStudentById,
  deleteStudentById,
  changePhoneNumber,
} = require("../services/student.service.js");
const { invalidateUserSessions } = require("../services/session.service.js");
const { isValidSemester } = require("../services/faculty.service.js");
const { storeOTP, verifyOTP } = require("../services/otp.service.js");
const { s3UploadDocuments } = require("../services/digitalocean.service.js");
const { sendOTPMessage } = require("../utils/telegramBot.js");
const { createUser } = require("../services/user.service.js");
const mongoose = require("mongoose");
const crypto = require("crypto");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class StudentController {
  /**
   *  @description Register New Student
   *  @route /api/v1/student/signup
   *  @method POST
   *  @access public
   */
  static signUp = catchAsyncError(async (req, res, next) => {
    let status, data, FileNames, message;
    const signUpData = _.pick(req.body, [
      "first_name",
      "last_name",
      "phone",
      "password",
      "gender",
      "semester",
      "faculty",
    ]);
    const { faculty, semester } = signUpData;

    ({ status, message } = await checkValidPhone(signUpData.phone));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await isValidSemester(faculty, semester));
    if (!status) return next(new AppError(message));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      ({ status, data, message } = await createUser(
        "Student",
        signUpData,
        session
      ));
      if (!status) throw new Error(message);

      ({ status, FileNames, message } = await s3UploadDocuments(
        req.files,
        "student"
      ));
      if (!status) throw new Error(message);
      const card = FileNames[0];

      ({ status, data, message } = await setStudentFC(data, card, session));
      if (!status) throw new Error(message);

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
   *  @description Get Student ID using his phone number
   *  @route /api/v1/student/mobile/:mobileNumber
   *  @method Get
   *  @access public
   */
  static getStudentId = catchAsyncError(async (req, res, next) => {
    const { mobileNumber } = req.query;
    const query = { phone: mobileNumber };

    const { status, _id, message } = await getStudentID(query);
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      _id,
    });
  });

  /**
   * @description Edit Student Phone Number
   * @route /api/v1/student/public/:id
   * @method Patch
   * @access public
   */
  static editPhoneNumber = catchAsyncError(async (req, res, next) => {
    let [status, message] = ["", ""];
    const { id } = req.params;
    const { phone } = req.body;

    ({ status, message } = await checkValidPhone(phone));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await changePhoneNumber(id, phone));
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   *  @description Get Student ID using his phone number
   *  @route /api/v1/student/password/:resetToken
   *  @method Patch
   *  @access public
   */
  static changePassword = catchAsyncError(async (req, res, next) => {
    let [status, message, _id] = ["", "", ""];
    const { resetToken } = req.query;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const query = { resetPassToken: hashedToken };

    ({ status, _id, message } = await getStudentID(query));
    if (!status) return next(new AppError(message, 404));

    ({ status, message } = await invalidateUserSessions(_id));
    if (!status) return next(new AppError(message, 500));

    ({ status, message } = await changePassword(_id, password));
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   * @description Get Student Favorite Doctors
   * @route /api/v1/student/favorites
   * @method Get
   * @access private
   */
  static gatFavoritesDoctors = catchAsyncError(async (req, res, next) => {
    const { _id, semester } = res.locals.user;
    const { status, data, message } = await getFavDoctors(_id, semester);
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Add Doctor to Student Favorite Doctors
   * @route /api/v1/doctors/doctorId/Student/favorites
   * @method Patch
   * @access private
   * @param {String} doctorId
   */
  static addFavoriteDoctor = catchAsyncError(async (req, res, next) => {
    const { _id } = res.locals.user;
    const { doctorId } = req.params;

    const { status, message } = await addFavDoctor(_id, doctorId);
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   * @description Remove Doctor from Student Favorite Doctors
   * @route /api/v1/doctors/doctorId/Student/favorites
   * @method Delete
   * @access private
   * @param {String} doctorId
   */
  static removeFavoriteDoctor = catchAsyncError(async (req, res, next) => {
    const { _id } = res.locals.user;
    const { doctorId } = req.params;

    const { status, message } = await removeFavDoctor(_id, doctorId);
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   *  @description Store Telegram Chat ID for student and send OTP code to him to verify his ID
   *  @route /api/v1/student/SaveID:studentId
   *  @method POST
   *  @access public
   */
  static SaveID = catchAsyncError(async (req, res, next) => {
    let [status, data, message] = ["", ""];
    const { _id } = res.locals.user;
    const { telegramId } = req.body;

    ({ status, data, message } = await storeTelegramID(_id, telegramId));
    if (!status) return next(new AppError(message));

    const otp = Math.floor(100000 + Math.random() * 900000);

    ({ status, message } = await storeOTP(_id, otp, "telegram"));
    if (!status) return next(new AppError(message));

    await sendOTPMessage(data.telegramId, otp);

    res.send({
      status: "success",
      message: "Telegram ID stored successfully",
    });
  });

  /**
   *  @description Verify Telegram ID using OTP Code
   *  @route /api/v1/student/verifyID
   *  @method POST
   *  @access public
   */
  static verifyID = catchAsyncError(async (req, res, next) => {
    let [status, type, message] = ["", ""];
    const { _id } = res.locals.user;
    const { otp } = req.body;

    ({ status, message, type } = await verifyOTP(_id, otp));
    if (!status) return next(new AppError(message));
    if (type !== "telegram") return next(new AppError("Invalid OTP Type"));

    ({ status, message } = await verifyTelegramID(_id));
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   *  @description Get All Students for Admin with pagination and filtering options
   *  @route /api/v1/student/
   *  @method Get
   *  @access private
   */
  static getStudents = catchAsyncError(async (req, res, next) => {
    const { page, limit, ...filter } = req.query;
    const filterDate = _.pick(filter, [
      "suspended",
      "isActive",
      "gender",
      "faculty",
      "semester",
    ]);

    const { status, data, message } = await getStudents(
      filterDate,
      page,
      limit
    );
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   *  @description Update Student Data for Admin to change (isActive, suspended)
   *  @route /api/v1/student/:id
   *  @method Patch
   *  @access private
   */
  static activateAndSuspendStudent = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const parsedData = _.pick(req.body, [
      "isActive",
      "suspended",
      "suspendedReason",
    ]);
    const updateData = {};

    if (parsedData.isActive) {
      updateData.isActive = parsedData.isActive;
    }

    if (_.isBoolean(parsedData.suspended)) {
      updateData.suspended = {
        value: parsedData.suspended,
        reason: parsedData?.suspendedReason || "resuming student account",
      };
    }

    const { status, message } = await updateStudentById(id, updateData);
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   *  @description Suspend Student Account for Student
   *  @route /api/v1/student
   *  @method Delete
   *  @access private
   */
  static deleteStudent = catchAsyncError(async (req, res, next) => {
    const { _id } = res.locals.user;

    const { status, message } = await deleteStudentById(_id);
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });
}
module.exports = StudentController;
