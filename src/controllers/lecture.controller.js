const {
  getLecture,
  getLectures,
  uploadLecture,
  confirmLectureService,
} = require("../services/lecture.service");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");
const _ = require("lodash");

class LectureController {
  /**
   * @description Get all lectures for students, doctors and admins
   * @route  /api/subjects/:subjectId/doctors/:doctorId/lectures | /api/subjects/:subjectId/lectures | /api/lectures
   * @method Get
   * @access Private
   * @param:
   * -param {subjectId} req for students and doctors
   * -param {doctorId} req for students
   * @query:
   * -query {confirmed} req for admins to get confirmed or unconfirmed lectures
   * -query {subjectId} req for admins to filter by subject
   * -query {doctorId} req for admins to filter by doctor
   */

  static getAllLectures = catchAsyncError(async (req, res, next) => {
    let [userType, query, excluded, populateFlag] = [
      res.locals.user.role,
      {},
      "",
      false,
    ];
    if (userType === "Admin") {
      const { confirmed, subjectId, doctorId } = req.query;

      query.confirmed =
        confirmed === "true" || confirmed === undefined ? true : false;

      query = subjectId ? { ...query, subject: subjectId } : query;
      query = doctorId ? { ...query, doctor: doctorId } : query;
      excluded = "-finalLayout  -__v";
      populateFlag = true;
    }

    if (userType === "Doctor") {
      const { subjectId } = req.params;
      const { _id } = res.locals.user;
      query = { subject: subjectId, doctor: _id };
      excluded = "-finalLayout -type -publishedBy -doctor -subject -__v";
    }

    if (userType === "Student") {
      const { subjectId, doctorId } = req.params;
      query = { subject: subjectId, doctor: doctorId, confirmed: true };
      excluded =
        "-subject -doctor -type -publishedBy -publishPrice -confirmed -finalLayout -__v -path";
    }

    const { status, data, message } = await getLectures(
      query,
      excluded,
      populateFlag
    );
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Add a new lecture to a subject
   * @route  /api/subjects/:subjectId/lectures
   * @method Post
   * @access Private
   * @param:
   * -param {subjectId} req incase doctor is the publisher
   * -param {doctorId} req incase library is the publisher
   * @body:
   * -body {name} req
   * -body {path} req
   * -body {description} req
   * -body {publishPrice} req
   */

  static addLecture = catchAsyncError(async (req, res, next) => {
    let doctor, publishedBy;

    const { subjectId, doctorId } = req.params;
    const { _id, role } = res.locals.user;

    let NewLecture = _.pick(req.body, [
      "name",
      "path",
      "description",
      "publishPrice",
    ]);
    if (role === "Doctor") [doctor, publishedBy] = [_id, _id];
    if (role === "Library") [doctor, publishedBy] = [doctorId, _id];

    NewLecture = {
      ...NewLecture,
      subject: subjectId,
      doctor,
      publishedBy,
      type: role,
    };

    const { status, data, message } = await uploadLecture(NewLecture);
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Lecture uploaded successfully",
    });
  });

  /**
   * @description Confirm a lecture to be published for students
   * @route  /api/lectures/:lectureId
   * @method Patch
   * @access Private
   * @param: lectureId
   * @body: {finalPrice , finalLayout}
   */

  static confirmLecture = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const confirmBody = _.pick(req.body, [
      "name",
      "no_slides",
      "description",
      "finalPrice",
      "finalLayout",
    ]);

    const { status, message } = await confirmLectureService(id, confirmBody);
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Lecture confirmed successfully",
    });
  });

  /**
   * @description Get a lecture by id
   * @route  /api/lectures/:lectureId
   * @method Get
   * @access Private
   * @param: lectureId
   */
  static getLectureById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { status, data, message } = await getLecture(id);
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      data,
    });
  });

  static deleteLecture = catchAsyncError(async (req, res, next) => {});
}

module.exports = LectureController;
