const {
  getFaculties,
  createFaculty,
  getFacultyByID,
} = require("../services/faculty.service");
const { addFacultyToUniversity } = require("../services/university.service");
const _ = require("lodash");

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
    query = { UniversityID: req.query?.universityID };

    const { status, data, message } = await getFaculties(query);
    if (!status) return next(new AppError(message, 500));

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

    const { status, data, message } = await getFacultyByID(id);
    if (!status) return next(new AppError(message, 404));

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
    let [status, data, message, faculty] = ["", "", "", ""];
    const newFaculty = _.pick(req.body, [
      "name",
      "no_of_semesters",
      "UniversityID",
    ]);

    ({ status, data, message } = await createFaculty(newFaculty));
    if (!status) return next(new AppError(message, 500));
    else faculty = data;

    ({ status, data, message } = await addFacultyToUniversity(
      newFaculty.UniversityID,
      data._id
    ));
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data: faculty,
    });
  });
}
module.exports = FacultyController;
