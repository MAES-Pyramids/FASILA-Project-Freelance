const { getFaculties, getFacultyByID } = require("../services/faculty.service");
const UniversityModel = require("../models/university.model");
const FacultyModel = require("../models/faculty.model");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class FacultyController {
  /**
   * @description Get all faculties
   * @route /api/v1/faculties
   * @method GET
   * @access private
   */
  static getALLFaculties = catchAsyncError(async (req, res, next) => {
    const { status, data } = await getFaculties();
    if (!status) return next(new AppError(500, data));

    res.send({
      status: "success",
      length: data.length,
      data,
    });
  });

  /**
   * @description Get a specific faculty by ID
   * @route /api/v1/faculties/:id
   * @method GET
   * @access private
   */
  static getFaculty = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { status, data } = await getFacultyByID(id);
    if (!status) return next(new AppError("Faculty Not Found", 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Add a new faculty
   * @route /api/v1/faculties ||
   * @method POST
   * @access private
   */
  static addFaculty = catchAsyncError(async (req, res, next) => {
    const { name, no_of_semesters, UniversityID } = req.body;

    const faculty = await FacultyModel.create({
      name,
      no_of_semesters,
    });

    const university = await UniversityModel.findById(UniversityID);
    university.faculties.push(faculty._id);
    await university.save();

    res.send({
      status: "success",
      data: faculty,
    });
  });
}
module.exports = FacultyController;
