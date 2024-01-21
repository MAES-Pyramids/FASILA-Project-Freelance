const { getStudentsNumber } = require("../services/student.service");
const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class StatisticsController {
  /**
   * @description Get the number of students
   * @route /api/v1/statistics/StudentsNumber
   * @method Get
   * @access private
   */
  static getStudentsNumber = catchAsyncError(async (req, res, next) => {
    const { status, data, message } = await getStudentsNumber();
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get the number of sold lectures
   * @route /api/v1/statistics/SoldLecturesNumber
   * @method Get
   * @access private
   */
  static getSoldLecturesNumber = catchAsyncError(async (req, res, next) => {
    const { status, data, message } = await getSoldLecturesNumber();
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });
}
module.exports = StatisticsController;
