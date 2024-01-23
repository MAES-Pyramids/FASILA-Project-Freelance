const { getLectures, uploadLecture } = require("../services/lecture.service");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");
const _ = require("lodash");

class LectureController {
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
      excluded = "-waterMarkLayout  -__v";
      populateFlag = true;
    }

    if (userType === "Doctor") {
      const { subjectId } = req.params;
      const { _id } = res.locals.user;
      query = { subject: subjectId, doctor: _id };
      excluded = "-waterMarkLayout -type -publishedBy -doctor -subject -__v";
    }

    if (userType === "Student") {
      const { subjectId, doctorId } = req.params;
      query = { subject: subjectId, doctor: doctorId, confirmed: true };
      excluded =
        "-subject -doctor -type -publishedBy -publishPrice -confirmed -waterMarkLayout";
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

  static confirmLecture = catchAsyncError(async (req, res, next) => {});
}

module.exports = LectureController;
