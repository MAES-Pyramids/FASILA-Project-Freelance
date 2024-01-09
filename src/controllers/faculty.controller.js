const FacultyModel = require("../models/faculty.model");
const UniversityModel = require("../models/university.model");

const AppError = require("../utils/appErrorsClass");
const catchAsyncError = require("../utils/catchAsyncErrors");

class FacultyController {
  static SetFacultyUniversityID = (req, res, next) => {
    if (!req.body.UniversityID) req.body.UniversityID = req.params.UniversityID;
    next();
  };

  static getALLFaculties = catchAsyncError(async (req, res, next) => {
    const faculties = await FacultyModel.find();
    res.json({
      status: "success",
      length: faculties.length,
      data: faculties,
    });
  });

  static getFaculty = catchAsyncError(async (req, res, next) => {});

  static addFaculty = catchAsyncError(async (req, res, next) => {
    const { UniversityID } = req.body;
    const { name, semestersMaxNumber } = req.body;
    if (!name || !semestersMaxNumber || !UniversityID)
      return next(new AppError("Missing required parameters", 400));

    const faculty = await FacultyModel.create({
      name,
      no_of_semesters: semestersMaxNumber,
    });

    const university = await UniversityModel.findById(UniversityID);
    university.faculties.push(faculty._id);
    await university.save();

    res.json({
      status: "success",
      message: "Faculty added successfully",
      data: faculty,
    });
  });
}
module.exports = FacultyController;
