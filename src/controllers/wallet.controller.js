const { deposit } = require("../services/wallet.service");
const { getStudentWalletId } = require("../services/student.service");

const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

class WalletController {
  /**
   * @description Update wallet value for the current user
   * @route /api/v1/student/:studentId/wallet
   * @method PATCH
   * @access private
   */
  static chargeWallet = catchAsyncError(async (req, res, next) => {
    let status, data, message;
    const { deposedThrough } = req.query;
    const { amount } = req.body;
    const { id } = req.params;

    ({ status, id, message } = await getStudentWalletId(id));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await deposit(id, amount, "Admin", deposedThrough));
    if (!status) return next(new AppError(message, 400));

    res.status(200).json({
      status: "success",
      message,
    });
  });
}
module.exports = WalletController;
