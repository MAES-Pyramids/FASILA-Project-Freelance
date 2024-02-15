const _ = require("lodash");
const {
  getSubjects,
  createSubject,
  getSubjectByID,
  addDoctorToSubject,
  removeDoctorFromSubject,
} = require("../services/subject.service");
const {
  checkStudentPurchasedLectures,
} = require("../services/purchases.service");
const { addSubjectId, settlePayment } = require("../services/doctor.service");
const { s3UploadDocuments } = require("../services/digitalocean.service");
const { getSubjectLectures } = require("../services/lecture.service");
const { isValidSemester } = require("../services/faculty.service");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");
const mongoose = require("mongoose");

class SubjectController {
  /**
   * @description Get logged in student subjects
   * @route /api/v1/subjects/MySubjects
   * @method GET
   * @access private
   */
  static getMySubjects = catchAsyncError(async (req, res, next) => {
    const { faculty, semester, _id } = res.locals.user;
    let PurchasedSubjects = [];
    const studentId = _id;

    const { status, data, message } = await getSubjects({
      faculty,
      semester,
    });
    if (!status) return next(new AppError(message, 404));

    for (const subject of data) {
      const { status, data } = await getSubjectLectures(subject._id);

      if (!status) continue;
      if (data.length == 0) continue;

      for (const lecture of data) {
        const { status } = await checkStudentPurchasedLectures(
          studentId,
          lecture
        );

        if (!status) continue;
        PurchasedSubjects.push(subject);
        break;
      }
    }

    res.send({
      status: "success",
      PurchasedSubjects,
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
    let status, data, message, FileNames;
    let newSubject = _.pick(req.body, ["name", "faculty", "semester"]);

    ({ status, message } = await isValidSemester(
      newSubject.faculty,
      newSubject.semester
    ));
    if (!status) return next(new AppError(message, 400));

    if (req.files) {
      ({ status, FileNames, message } = await s3UploadDocuments(
        req.files,
        "subject"
      ));
      if (!status) throw new Error(message);
      newSubject = { ...newSubject, photo: FileNames[0] };
    }

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
    let status, data, message;
    const { id } = req.params;
    const { type } = req.query;
    const { doctor } = _.pick(req.body, ["doctor"]);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      ({ status, data, message } =
        type == "remove"
          ? await removeDoctorFromSubject(id, doctor)
          : await addDoctorToSubject(id, doctor, session));
      if (!status) throw new Error(message);

      if (type == "add") {
        ({ status, data, message } = await addSubjectId(doctor, id, session));
        if (!status) throw new Error(message);
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      return next(new AppError(err.message, 500));
    }

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Settle subject payment
   * @route /api/v1/subjects/:subjectId/Payment
   * @method Get
   * @access private
   */
  static settleSubjectPayment = catchAsyncError(async (req, res, next) => {
    const { subjectId, doctorId } = req.params;

    const { status, message } = await settlePayment(doctorId, subjectId);
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Payment settled successfully",
    });
  });

  /**
   * @description Settle all subjects payment
   * @route /api/v1/subjects/Payment
   * @method Get
   * @access private
   */
  static settleAllSubjectsPayment = catchAsyncError(async (req, res, next) => {
    const { doctorId } = req.params;

    const { status, message } = await settlePayment(doctorId);
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Payment settled successfully",
    });
  });
}
module.exports = SubjectController;
