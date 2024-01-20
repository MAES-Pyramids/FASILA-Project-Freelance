const {
  getStudentID,
  changePassword,
  checkValidPhone,
  storeTelegramID,
  verifyTelegramID,
} = require("../services/student.service.js");
const { invalidateUserSessions } = require("../services/session.service.js");
const { isValidSemester } = require("../services/faculty.service.js");
const { storeOTP, verifyOTP } = require("../services/otp.service.js");
const { sendOTPMessage } = require("../utils/telegramBot.js");
const { createUser } = require("../services/user.service.js");
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
    let [status, data, message] = ["", "", ""];
    const signUpData = _.pick(req.body, [
      "name",
      "phone",
      "password",
      "gender",
      "semester",
      "facultyCard",
      "faculty",
    ]);

    ({ status, data, message } = await checkValidPhone(signUpData.phone));
    if (!status) next(new AppError(message, 400));

    ({ status, message } = await isValidSemester(
      signUpData.faculty,
      signUpData.semester
    ));
    if (!status) next(new AppError(message));

    ({ status, data, message } = await createUser("Student", signUpData));
    if (!status) next(new AppError(message, 500));

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
    const { mobileNumber } = req.params;
    const query = { phone: mobileNumber };

    const { status, data, message } = await getStudentID(query);
    if (!status) return next(new AppError(message, 404));

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

    ({ status, data, message } = await getStudentID(query));
    if (!status) return next(new AppError(message, 404));

    await invalidateUserSessions(student._id);
    ({ status, message } = await changePassword(student._id, password));
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

    sendOTPMessage(student.telegramId, otp);

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
}
module.exports = StudentController;
