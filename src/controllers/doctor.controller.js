const {
  createDoctor,
  getAllDoctors,
  getDoctorByID,
} = require("../services/doctor.service");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class DoctorController {
  /**
   * @description Get all doctors with ability to filter faculty
   * @route /api/v1/doctors
   * @method GET
   * @access private
   */
  static getDoctors = catchAsyncError(async (req, res, next) => {
    const { faculty } = req.query;
    const query = faculty != null ? { faculty } : {};

    const { status, data, message } = await getAllDoctors(query);
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get doctor by id
   * @route /api/v1/doctors/:id
   * @method GET
   * @access private
   */
  static getDoctorById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { status, data, message } = await getDoctorByID(id);
    if (!status) return next(new AppError(message, 404));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Create a new doctor account by admin
   * @route /api/v1/doctors
   * @method Post
   * @access private
   */
  static addDoctor = catchAsyncError(async (req, res, next) => {
    const newDoctor = _.pick(req.body, [
      "name",
      "phone",
      "password",
      "faculty",
    ]);

    const { status, data, message } = await createDoctor(newDoctor);
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });
}
module.exports = DoctorController;
