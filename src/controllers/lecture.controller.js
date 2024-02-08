const {
  uploadLecture,
  checkLectureStatus,
  getLecturesForAdmin,
  getPurchasedLectures,
  getLecturesForDoctor,
  getLecturesForStudent,
  confirmLectureService,
} = require("../services/lecture.service");
const {
  createNewPL,
  updatePLectureKey,
  isLecturePurchased,
  isPurchasedLectureAllowed,
} = require("../services/purchases.service");
const { withdraw } = require("../services/wallet.service");
const { getStudentWalletId } = require("../services/student.service");
const {
  deleteDocument,
  s3UploadDocuments,
  checkIfDocumentExist,
} = require("../services/digitalocean.service");
// const { getCardIframe } = require("../utils/payment");
// const { getStudentPaymentData } = require("../services/student.service");
// const { getLecturePaymentData } = require("../services/lecture.service");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");
const mongoose = require("mongoose");
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
   * -body {key} req
   * -body {description} req
   * -body {publishPrice} req
   */
  static addLecture = catchAsyncError(async (req, res, next) => {
    let doctor, publishedBy;

    const { subjectId, doctorId } = req.params;
    const { _id, role } = res.locals.user;

    let NewLecture = _.pick(req.body, [
      "name",
      "key",
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
   * @body: {finalPrice , waterMarkDetails}
   */
  static confirmLecture = catchAsyncError(async (req, res, next) => {
    let status, FileNames, message;
    const { lectureId } = req.params;
    let confirmBody = _.pick(req.body, [
      "name",
      "no_slides",
      "description",
      "finalPrice",
      "waterMarkDetails",
    ]);
    confirmBody.waterMarkDetails = JSON.parse(confirmBody.waterMarkDetails);

    if (req.files) {
      ({ status, FileNames, message } = await s3UploadDocuments(
        req.files,
        "pdf-preview"
      ));
      if (!status) throw new Error(message);
      confirmBody = { ...confirmBody, preview_path: FileNames[0] };
    }

    ({ status, message } = await confirmLectureService(lectureId, confirmBody));
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
    let status, lecture, message, walletId;
    const { lectureId } = req.params;
    const { _id } = res.locals.user;

    const emptyPageDetails = _.pick(req.query, [
      "addEmptyPages",
      "addEmptyPageAfter",
      "addTwoEmptyPagesAtEnd",
    ]);

    ({ status, message } = await isLecturePurchased(_id, lectureId));
    if (!status) return next(new AppError(message, 400));

    ({ status, lecture, message } = await checkLectureStatus(lectureId));
    if (!status) return next(new AppError(message, 404));

    const PLectureData = {
      student: _id,
      lecture: lectureId,
      emptyPageDetails,
    };

    if (!lecture.isFree) {
      const session = await mongoose.startSession({ validateBeforeSave: true });
      session.startTransaction();
      try {
        ({ status, walletId, message } = await getStudentWalletId(_id));
        if (!status) throw new Error(message);

        const { finalPrice } = lecture;
        ({ status, message } = await withdraw(
          session,
          walletId,
          finalPrice,
          lectureId
        ));
        if (!status) throw new Error(message);

        ({ status, message } = await createNewPL(
          PLectureData,
          finalPrice,
          session
        ));
        if (!status) throw new Error(message);

        await session.commitTransaction();
        session.endSession();
      } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return next(new AppError(err.message, 500));
      }
    }
    if (lecture.isFree) {
      ({ status, message } = await createNewPL(PLectureData, 0));
      if (!status) return next(new AppError(message, 400));
    }

    res.send({
      status: "success",
      message,
    });
  });

  /**
   * @description Used by student to save a updated lecture
   * @route  /api/lectures/:lectureId
   * @method Patch
   * @access Private
   * @param: lectureId
   */
  static saveLecture = catchAsyncError(async (req, res, next) => {
    let status, data, oldKey, message;
    const { lectureId } = req.params;
    const { _id } = res.locals.user;
    const { key } = req.body;

    ({ status, data, message } = await isPurchasedLectureAllowed(
      _id,
      lectureId
    ));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await checkIfDocumentExist(key));
    if (!status) return next(new AppError(message, 400));

    oldKey = data.key;

    ({ status, message } = await updatePLectureKey(lectureId, key));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await deleteDocument(oldKey));
    if (!status) return next(new AppError(message, 400));

    res.send({
      status: "success",
      message: "Lecture updated successfully",
    });
  });

  /**
   * @description Get all Purchased lectures for a specific student
   * @route  /api/v1/doctors/{doctorId}/Subjects/{lectureId}/Lectures/My
   * @method Get
   * @access Private
   */
  static getMyLectures = catchAsyncError(async (req, res, next) => {
    const { _id } = res.locals.user;
    const { subjectId } = req.params;

    const { status, data, message } = await getPurchasedLectures(
      { subject: subjectId },
      _id
    );
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      data,
    });
  });
}

module.exports = LectureController;

// const orderData = getLecturePaymentData(lecture);

// ({ status, customerData, message } = await getStudentPaymentData(_id));
// if (!status) return next(new AppError(message, 400));

// const merchant_id = `${lectureId}-${_id}-${Date.now()}`;
// ({ status, IFrame, message } = await getCardIframe(
//   merchant_id,
//   customerData,
//   orderData
// ));
// if (!status) return next(new AppError(message, 400));
