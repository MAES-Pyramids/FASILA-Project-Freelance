const DoctorModel = require("../models/doctor.model");
const facultyModel = require("../models/faculty.model");

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
    const doctors = await DoctorModel.find();

    res.send({
      status: "success",
      length: doctors.length,
      data: doctors,
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
