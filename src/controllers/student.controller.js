const studentModel = require("../models/student.model.js");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class StudentController {
  /**
   *  @description Register New Student
   *  @route /api/student/signup
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
    const student = await studentModel.findOne({ phone: signUpData.phone });
    if (student) next(new AppError("Existing account with same mobile number"));

    // Hash password
    const salt = await bcrypt.genSalt(10);
    signUpData.password = await bcrypt.hash(signUpData.password, salt);

    const newStudent = await studentModel.create(signUpData);
    res.json({
      status: "success",
      message: "Account created successfully",
      data: newStudent,
    });
  });
}
module.exports = StudentController;
