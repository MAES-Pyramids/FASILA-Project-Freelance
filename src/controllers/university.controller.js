const UniversityModel = require("../models/university.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class UniversityController {
  /**
   * @description Get all universities
   * @route /api/v1/universities
   * @method GET
   * @access public
   */
  static getALLUniversities = catchAsyncError(async (req, res, next) => {
    const universities = await UniversityModel.find();

    res.json({
      status: "success",
      length: universities.length,
      data: universities,
    });
  });

  /**
   * @description Get a specific university by ID
   * @route /api/v1/universities/:id
   * @method GET
   * @access public
   */
  static getUniversity = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const university = await UniversityModel.findById(id);
    if (!university) return next(new AppError("University not found", 404));

    res.json({
      status: "success",
      data: university,
    });
  });

  /**
   * @description Add a new university
   * @route /api/v1/universities
   * @method POST
   * @access public
   */
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
