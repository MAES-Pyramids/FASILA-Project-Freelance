const { getAllDoctors, getDoctorByID } = require("../services/doctor.service");
const DoctorModel = require("../models/doctor.model");

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

    const { status, data } = await getAllDoctors(query);
    if (!status) return next(new AppError(500, data));

    res.send({
      status: "success",
      length: data.length,
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

    const { status, data } = await getDoctorByID(id);
    if (!status) return next(new AppError(404, "Doctor not found"));

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
  static createDoctor = catchAsyncError(async (req, res, next) => {
    const { name, phone, password, faculty } = req.body;

    const doctor = await DoctorModel.create({
      name,
      phone,
      password,
      faculty,
    });

    res.send({
      status: "success",
      data: doctor,
    });
  });
}
module.exports = DoctorController;
