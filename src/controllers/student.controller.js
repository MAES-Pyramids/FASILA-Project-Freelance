const {
  getStudentID,
  changePassword,
  checkValidPhone,
} = require("../services/student.service.js");
const { invalidateUserSessions } = require("../services/session.service.js");
const { isValidSemester } = require("../services/faculty.service.js");
const { sendOTPMessage } = require("../utils/telegramBot.js");
const { createUser } = require("../services/user.service.js");
const StudentModel = require("../models/student.model.js");
const FacultyModel = require("../models/faculty.model.js");
const otpModel = require("../models/otp.model.js");
const bcrypt = require("bcryptjs");
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
    let [status, data] = ["", ""];
    const signUpData = _.pick(req.body, [
      "name",
      "phone",
      "password",
      "gender",
      "semester",
      "facultyCard",
      "faculty",
    ]);

    ({ status, data } = await checkValidPhone(signUpData.phone));
    if (!status) next(new AppError(data));

    ({ status, data } = await isValidSemester(
      signUpData.faculty,
      signUpData.semester
    ));
    if (!status) next(new AppError(data));

    ({ status, data } = await createUser("Student", signUpData));
    if (!status) next(new AppError(data));

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
  static getStudentID = catchAsyncError(async (req, res, next) => {
    const { mobileNumber } = req.params;
    const query = { phone: mobileNumber };

    const { status, data } = await getStudentID(query);
    if (!status) return next(new AppError(data));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   *  @description Get Student ID using his phone number
   *  @route /api/v1/student/password/:resetToken
   *  @method Patch
   *  @access public
   */
  static changePassword = catchAsyncError(async (req, res, next) => {
    let [status, data, message] = ["", "", ""];
    const { resetToken } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const query = { resetPassToken: hashedToken };

    ({ status, data } = await getStudentID(query));
    if (!status) return next(new AppError(data));

    await invalidateUserSessions(student._id);
    ({ status, message } = await changePassword(student._id, password));
    if (!status) return next(new AppError(message));

    res.send({
      status: "success",
      message,
    });
  });

  /**
   *  @description Store Telegram Chat ID for student
   *  @route /api/v1/student/SaveID:studentId
   *  @method POST
   *  @access public
   */
  static SaveID = catchAsyncError(async (req, res, next) => {
    const { studentId } = req.params;
    const { telegramId } = req.body;

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));

    student.telegramId = telegramId;
    student.idStored = true;
    await student.save();

    res.send({
      status: "success",
      message: "Telegram ID stored successfully",
    });
  });

  /**
   *  @description Send OTP code to student via Telegram
   *  @route /api/v1/student/SendOTP/:studentId?Type=verify||reset||force
   *  @method Get
   *  @access public
   */
  static SendTelegramOTP = catchAsyncError(async (req, res, next) => {
    const { studentId } = req.params;
    const { Type } = req.query;

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));

    let studentOTP = await otpModel.findOne({ student: studentId });
    if (studentOTP) await otpModel.findByIdAndDelete(studentOTP._id);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp.toString(), salt);

    studentOTP = await otpModel.create({
      OTPType: Type,
      otp: hashedOTP,
      student: studentId,
    });

    sendOTPMessage(student.telegramId, otp);
    res.send({
      status: "success",
      message: "OTP sent successfully",
    });
  });

  /**
   *  @description Verify Telegram ID using OTP Code
   *  @route /api/v1/student/verifyID
   *  @method POST
   *  @access public
   */
  static verifyID = catchAsyncError(async (req, res, next) => {
    const { studentId } = req.params;
    const { otp } = req.body;

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));

    const studentOTP = await otpModel.findOne({ student: studentId });
    if (!studentOTP || studentOTP.OTPType !== "verify")
      return next(new AppError("OTP not found", 404));

    if (studentOTP.expiresAt < Date.now()) {
      await otpModel.findByIdAndDelete(studentOTP._id);
      return next(new AppError("OTP is expired", 400));
    }

    const isMatch = await bcrypt.compare(otp, studentOTP.otp);
    if (!isMatch) return next(new AppError("Invalid OTP", 400));

    student.verified = true;
    await student.save();

    await otpModel.deleteMany({ student: studentId });

    res.send({
      status: "success",
      message: "Student verified successfully",
    });
  });
}
module.exports = StudentController;
