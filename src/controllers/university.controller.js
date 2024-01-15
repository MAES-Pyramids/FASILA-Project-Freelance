const UniversityModel = require("../models/university.model");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class UniversityController {
  /**
   * @description Get all universities
   * @route /api/v1/universities
   * @method GET
   * @access private
   */
  static getALLUniversities = catchAsyncError(async (req, res, next) => {
    const universities = await UniversityModel.find();

    res.send({
      status: "success",
      length: universities.length,
      data: universities,
    });
  });

  /**
   * @description Get a specific university by ID
   * @route /api/v1/universities/:id
   * @method GET
   * @access private
   */
  static getUniversity = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const university = await UniversityModel.findById(id);
    if (!university) return next(new AppError("University not found", 404));

    res.send({
      status: "success",
      data: university,
    });
  });

  /**
   * @description Add a new university
   * @route /api/v1/universities
   * @method POST
   * @access private
   */
  static addUniversity = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    const university = await UniversityModel.create({ name });

    res.send({
      status: "success",
      message: "University added successfully",
      data: university,
    });
  });
}
module.exports = UniversityController;
