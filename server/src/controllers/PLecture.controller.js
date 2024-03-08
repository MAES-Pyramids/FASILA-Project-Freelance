const {
  getPLecturePath,
  isPurchasedLectureAllowed,
} = require("../services/purchases.service");
const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

const _ = require("lodash");

class LectureController {
  /**
   * @description Get PLectures Path and Password
   * @route  /api/v1/PLectures/:PLectureId
   * @method Get
   * @access Private
   * @param:
   * -param {PLectureId}
   */
  static getPLecturePathAndPassword = catchAsyncError(
    async (req, res, next) => {
      let status, data, message;
      const { PLectureId } = req.params;
      const { _id } = res.locals.user;

      ({ status, data, message } = await isPurchasedLectureAllowed(
        _id,
        PLectureId
      ));
      if (!status) return next(new AppError(message, 401));

      ({ status, data, message } = await getPLecturePath(PLectureId));
      if (!status) return next(new AppError(message, 500));

      res.status(200).json({
        status: "success",
        data,
      });
    }
  );
}

module.exports = LectureController;
