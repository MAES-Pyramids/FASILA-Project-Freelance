const FacultyModel = require("../models/faculty.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class FacultyController {
  static getALLFaculties = catchAsyncError(async (req, res, next) => {});
  static getFaculty = catchAsyncError(async (req, res, next) => {});
  static addFaculty = catchAsyncError(async (req, res, next) => {});
}
module.exports = FacultyController;
