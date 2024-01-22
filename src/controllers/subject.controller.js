const _ = require("lodash");
const {
  getSubjects,
  createSubject,
  getSubjectByID,
  addDoctorToSubject,
  removeDoctorFromSubject,
} = require("../services/subject.service");
const { isValidSemester } = require("../services/faculty.service");

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

    const { status, data, message } = await getSubjects({ faculty, semester });
    if (!status) return next(new AppError(message, 404));

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
    let [userType, query, excluded] = [res.locals.user.role, {}, {}];

    if (userType === "Admin") {
      const { faculty, semester } = req.query;
      if (faculty) query.faculty = faculty;
      if (semester) query.semester = semester;
    }

    if (userType === "Student") {
      const { faculty, semester } = res.locals.user;
      query = { faculty, semester };
      excluded = "-faculty -semester -__v";
    }

    if (userType === "Doctor") {
      const { faculty, _id } = res.locals.user;
      query = { faculty, _id };
      excluded = "-faculty -doctors -__v";
    }

    const { status, data, message } = await getSubjects(query, excluded);
    if (!status) return next(new AppError(message, 404));

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
    const excluded = "-faculty -semester -__v";

    const { status, data, message } = await getSubjectByID(id, excluded);
    if (!status) return next(new AppError(message, 404));

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
    const newSubject = _.pick(req.body, ["name", "faculty", "semester"]);
    let [status, data, message] = ["", "", ""];

    ({ status, message } = await isValidSemester(
      newSubject.faculty,
      newSubject.semester
    ));
    if (!status) return next(new AppError(message, 400));

    ({ status, data, message } = await createSubject(newSubject));
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Update a subject
   * @route /api/v1/subjects/:id
   * @method PATCH
   * @access private
   */
  static updateSubject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { type } = req.query;
    const { doctor } = _.pick(req.body, ["doctor"]);

    const { status, data, message } =
      type == "remove"
        ? await removeDoctorFromSubject(id, doctor)
        : await addDoctorToSubject(id, doctor);
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      data,
    });
  });
}
module.exports = SubjectController;
