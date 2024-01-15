const FacultyModel = require("../models/faculty.model");
const UniversityModel = require("../models/university.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class FacultyController {
  /**
   * @description Get all faculties
   * @route /api/v1/faculties
   * @method GET
   * @access public
   */
  static getALLFaculties = catchAsyncError(async (req, res, next) => {
    const faculties = await FacultyModel.find();

    res.send({
      status: "success",
      length: faculties.length,
      data: faculties,
    });
  });

  /**
   * @description Get a specific faculty by ID
   * @route /api/v1/faculties/:id
   * @method GET
   * @access public
   */
  static getFaculty = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const faculty = await FacultyModel.findById(id);
    if (!faculty) return next(new AppError("Faculty not found", 404));

    res.send({
      status: "success",
      data: faculty,
    });
  });

  /**
   * @description Add a new faculty
   * @route /api/v1/faculties ||
   * @method POST
   * @access public
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
