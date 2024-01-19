const {
  addUniversity,
  getUniversities,
  getUniversityByID,
} = require("../services/university.service");
const UniversityModel = require("../models/university.model");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");
const { get } = require("lodash");

class UniversityController {
  /**
   * @description Get all universities
   * @route /api/v1/universities
   * @method GET
   * @access private
   */
  static getALLUniversities = catchAsyncError(async (req, res, next) => {
    const { status, data } = await getUniversities();
    if (!status) return next(new AppError(data, 500));

    res.send({
      status: "success",
      length: data.length,
      data,
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

    const { status, data } = await getUniversityByID(id);
    if (!status) return next(new AppError("University not found", 404));

    res.send({
      status: "success",
      data,
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
    const { status, data } = await addUniversity(name);
    if (!status) return next(new AppError(data, 500));

    res.send({
      status: "success",
      data,
    });
  });
}
module.exports = UniversityController;
