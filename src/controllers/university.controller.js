const UniversityModel = require("../models/university.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class UniversityController {
  static getALLUniversities = catchAsyncError(async (req, res, next) => {});
  static getUniversity = catchAsyncError(async (req, res, next) => {});
  static addUniversity = catchAsyncError(async (req, res, next) => {});
}
module.exports = UniversityController;
