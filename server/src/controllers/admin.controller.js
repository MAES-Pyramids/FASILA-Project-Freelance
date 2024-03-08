const { createAdmin, getAdmins } = require("../services/admin.service");
const _ = require("lodash");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class AdminController {
  /**
   * @description Create a new admin account by super Admin
   * @route /api/v1/admins
   * @method Post
   * @access private
   */
  static addAdmin = catchAsyncError(async (req, res, next) => {
    const newAdmin = _.pick(req.body, ["name", "phone", "password"]);

    const { status, data, message } = await createAdmin(newAdmin);
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });

  /**
   * @description Get all admins
   * @route /api/v1/admins
   * @method Get
   * @access private
   */
  static getAdmins = catchAsyncError(async (req, res, next) => {
    const { status, data, message } = await getAdmins();
    if (!status) return next(new AppError(message, 500));

    res.send({
      status: "success",
      data,
    });
  });
}
module.exports = AdminController;
