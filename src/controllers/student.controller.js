const StudentModel = require("../models/student.model.js");
const otpModel = require("../models/otp.model.js");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");
const { sendOTPMessage } = require("../utils/telegramBot.js");

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

    // check if there account with same mobile number
    const student = await StudentModel.findOne({ phone: signUpData.phone });
    if (student) next(new AppError("Existing account with same mobile number"));

    let newStudent = await StudentModel.create(signUpData);
    newStudent = _.omit(newStudent.toObject(), ["password"]);

    res.json({
      status: "success",
      message: "Account created successfully",
      data: newStudent,
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

    if (!telegramId || !studentId)
      return next(new AppError("Missing required parameters", 400));

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));
    if (student.verified) return next(new AppError("Student is verified", 400));

    student.telegramId = telegramId;
    student.idStored = true;
    await student.save();

    res.json({
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
  static SendOTP = catchAsyncError(async (req, res, next) => {
    const { studentId } = req.params;
    const { Type } = req.query;

    if (!studentId || !Type)
      return next(new AppError("Missing required parameters"));

    if (!["verify", "reset", "Force"].includes(Type))
      return next(new AppError("Invalid OTP type"));

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));

    // Check if there is OTP for this student
    let studentOTP = await otpModel.findOne({ student: studentId });
    if (studentOTP) await otpModel.findByIdAndDelete(studentOTP._id);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp.toString(), salt);

    studentOTP = await otpModel.create({
      OTPType: Type,
      otp: hashedOTP,
      student: studentId,
    });

    // Send OTP to student
    sendOTPMessage(student.telegramId, otp);
    res.json({
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

    if (!studentId || !otp)
      return next(new AppError("Missing required parameters", 400));

    const student = await StudentModel.findById(studentId);
    if (!student) return next(new AppError("Student not found", 404));
    if (student.verified) return next(new AppError("Student is verified", 400));

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

    res.json({
      status: "success",
      message: "Student verified successfully",
    });
  });
}
module.exports = StudentController;
