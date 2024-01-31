class WalletController {
  /**
   * @description Get wallet value for the current user
   * @route /api/v1/student/wallet
   * @method GET
   * @access private
   */
  static getWallet = catchAsyncError(async (req, res, next) => {});

  /**
   * @description Update wallet value for the current user
   * @route /api/v1/student/:studentId/wallet
   * @method PATCH
   * @access private
   */
  static updateWallet = catchAsyncError(async (req, res, next) => {});
}
module.exports = WalletController;
