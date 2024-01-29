const {
  checkLectureStatus,
  getLecturesForAdmin,
  getLecturesForDoctor,
  getLecturesForStudent,
  confirmLectureService,
  uploadLecture,
} = require("../services/lecture.service");
const {
  createNewPL,
  isLecturePurchased,
} = require("../services/purchases.service");
const { getCardIframe } = require("../utils/payment");
const { getStudentPaymentData } = require("../services/student.service");
const { getLecturePaymentData } = require("../services/lecture.service");

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
    let [userType, query] = [res.locals.user.role, {}];
    let [status, data, message] = [, ,];

    if (userType === "Admin") {
      const { confirmed, subjectId, doctorId } = req.query;

      query.confirmed =
        confirmed === "true" || confirmed === undefined ? true : false;
      query = subjectId ? { ...query, subject: subjectId } : query;
      query = doctorId ? { ...query, doctor: doctorId } : query;

      ({ status, data, message } = await getLecturesForAdmin(query));
    }

    if (userType === "Doctor") {
      const { _id } = res.locals.user;
      const { subjectId } = req.params;
      query = { subject: subjectId, doctor: _id };
      ({ status, data, message } = await getLecturesForDoctor(query));
    }

    if (userType === "Student") {
      const { _id } = res.locals.user;
      const { subjectId, doctorId } = req.params;
      query = { subject: subjectId, doctor: doctorId, confirmed: true };
      ({ status, data, message } = await getLecturesForStudent(query, _id));
    }

    if (userType === "Library") {
      ({ status, message } = {
        status: false,
        message: "Libraries can't access lectures yet",
      });
    }

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
    const { lectureId } = req.params;
    const confirmBody = _.pick(req.body, [
      "name",
      "no_slides",
      "description",
      "finalPrice",
      "finalLayout",
    ]);

    const { status, message } = await confirmLectureService(
      lectureId,
      confirmBody
    );
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Lecture confirmed successfully",
    });
  });

  /**
   * @description Used by student to purchase a lecture
   * @route  /api/lectures/:lectureId
   * @method Get
   * @access Private
   * @param: lectureId
   */
  static byLecture = catchAsyncError(async (req, res, next) => {
    let status, lecture, message, customerData, IFrame, PLecture;
    const { lectureId } = req.params;
    const { _id } = res.locals.user;

    ({ status, message } = await isLecturePurchased(_id, lectureId));
    if (!status) return next(new AppError(message, 400));

    ({ status, lecture, message } = await checkLectureStatus(lectureId));
    if (!status) return next(new AppError(message, 404));

    if (!lecture.isFree) {
      const orderData = getLecturePaymentData(lecture);

      ({ status, customerData, message } = await getStudentPaymentData(_id));
      if (!status) return next(new AppError(message, 400));

      const merchant_id = `${lectureId}-${_id}-${Date.now()} `;
      ({ status, IFrame, message } = await getCardIframe(
        merchant_id,
        customerData,
        orderData
      ));
      if (!status) return next(new AppError(message, 400));

      res.send({
        status: "success",
        IFrame,
      });
    }

    if (lecture.isFree) {
      //TODO we still need to edit createNewPl to make worker process works and upload to digital ocean also
      ({ status, PLecture } = await createNewPL(_id, lectureId));
      if (!status) return next(new AppError(message, 400));

      res.send({
        status: "success",
        path: PLecture.path,
      });
    }
  });

  static deleteLecture = catchAsyncError(async (req, res, next) => {});
}

module.exports = LectureController;
