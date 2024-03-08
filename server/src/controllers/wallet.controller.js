const {
  deposit,
  getWalletTransactions,
} = require("../services/wallet.service");
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
    let status, walletId, message;
    const { deposedThrough } = req.query;
    const { studentId } = req.params;
    const { amount } = req.body;
    const { _id } = res.locals.user;

    ({ status, walletId, message } = await getStudentWalletId(studentId));
    if (!status) return next(new AppError(message, 400));

    ({ status, message } = await deposit(
      walletId,
      amount,
      "Admin",
      deposedThrough,
      { manually: _id }
    ));
    if (!status) return next(new AppError(message, 400));

    res.status(200).json({
      status: "success",
      message,
    });
  });

  /**
   * @description get transaction history for the current user
   * @route /api/v1/student/:studentId/wallet
   * @method Get
   * @access private
   */
  static getTransactionHistory = catchAsyncError(async (req, res, next) => {
    let status, walletId, data, message;
    const { studentId } = req.params;
    const { _id } = res.locals.user;
    const id = studentId || _id;

    ({ status, walletId, message } = await getStudentWalletId(id));
    if (!status) return next(new AppError(message, 400));

    ({ status, data, message } = await getWalletTransactions(walletId));
    if (!status) return next(new AppError(message, 400));

    res.status(200).json({
      status: "success",
      data,
    });
  });
}
module.exports = WalletController;
