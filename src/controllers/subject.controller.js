const { getSubjects, getSubjectById } = require("../services/subject.service");
const SubjectModel = require("../models/subject.model");
const FacultyModel = require("../models/faculty.model");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class SubjectController {
  /**
   * @description Get logged in student subjects
   * @route /api/v1/subjects/MySubjects
   * @method GET
   * @access private
   */
  static getMySubjects = catchAsyncError(async (req, res, next) => {
    const { faculty, semester } = res.locals.user;

    const { status, data } = await getSubjects({ faculty, semester });
    if (status === "error") return next(new AppError(data, 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get subjects based on user type( filter  by faculty or semester)
   * @route /api/v1/subjects
   * @method GET
   * @access private
   */
  static getALLSubjects = catchAsyncError(async (req, res, next) => {
    let [userType, query] = [res.locals.user.role, {}];

    if (userType === "Admin") {
      const { faculty, semester } = req.query;
      if (faculty) query.faculty = faculty;
      if (semester) query.semester = semester;
    }

    if (userType === "Student") {
      const { faculty, semester } = res.locals.user;
      query = { faculty, semester };
    }

    const { status, data } = await getSubjects(query);
    if (status === "error") {
      return next(new AppError(data, 404));
    }

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get a specific subject by ID
   * @route /api/v1/subjects/:id
   * @method GET
   * @access private
   */
  static getSubjectById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { status, data } = await getSubjectById(id);
    if (status === "error") return next(new AppError(data, 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Add a new subject
   * @route /api/v1/subjects
   * @method POST
   * @access private
   */
  static addSubject = catchAsyncError(async (req, res, next) => {
    const data = _.pick(req.body, ["name", "faculty", "semester", "doctors"]);

    const maxSem = (await FacultyModel.findById(data.faculty)).no_of_semesters;
    if (data.semester > maxSem) next(new AppError("Invalid semester number"));

    const subject = await SubjectModel.create(data);

    res.send({
      status: "success",
      data: subject,
    });
  });
}
module.exports = SubjectController;
