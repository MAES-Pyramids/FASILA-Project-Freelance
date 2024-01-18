const { invalidateUserSession } = require("../services/session.service.js");
const { sendOTPMessage } = require("../utils/telegramBot.js");
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
    // Select required parameters only
    const signUpData = _.pick(req.body, [
      "name",
      "phone",
      "password",
      "gender",
      "semester",
      "facultyCard",
      "faculty",
    ]);

    const student = await StudentModel.findOne({ phone: signUpData.phone });
    if (student) next(new AppError("Existing account with same mobile number"));

    const maxSemester = (await FacultyModel.findById(signUpData.faculty))
      .no_of_semesters;
    if (semester > maxSemester) next(new AppError("Invalid semester number"));

    let newStudent = await StudentModel.create(signUpData);
    newStudent = _.omit(newStudent.toObject(), ["password"]);

    res.send({
      status: "success",
      message: "Account created successfully",
      data: newStudent,
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

    const student = await StudentModel.findOne({ phone: mobileNumber });
    if (!student) return next(new AppError("Student not found", 404));

    res.send({
      status: "success",
      data: { studentId: student._id },
    });
  });

  /**
   *  @description Get Student ID using his phone number
   *  @route /api/v1/student/password/:resetToken
   *  @method Patch
   *  @access public
   */
  static changePassword = catchAsyncError(async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const student = await StudentModel.findOne({
      resetPassToken: hashedToken,
      resetPassExpires: { $gt: Date.now() },
    });
    if (!student) return next(new AppError("Invalid or expired token", 400));

    await invalidateUserSession(student._id);

    student.password = password;
    student.resetPassToken = undefined;
    student.resetPassExpires = undefined;
    await student.save();

    res.send({
      status: "success",
      message: "Password changed successfully",
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
   *  @route /api/v1/student/SendOTP/:studentId?Type=verify||reset||Force
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
