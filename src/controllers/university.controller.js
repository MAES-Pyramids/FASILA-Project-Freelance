const UniversityModel = require("../models/university.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class UniversityController {
  static getALLUniversities = catchAsyncError(async (req, res, next) => {
    const universities = await UniversityModel.find();
    res.json({
      status: "success",
      length: universities.length,
      data: universities,
    });
  });

  static getUniversity = catchAsyncError(async (req, res, next) => {});

  static addUniversity = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    if (!name) return next(new AppError("Missing required parameters", 400));

    const university = await UniversityModel.create({ name });
    res.json({
      status: "success",
      message: "University added successfully",
      data: university,
    });
  });
}
module.exports = UniversityController;
