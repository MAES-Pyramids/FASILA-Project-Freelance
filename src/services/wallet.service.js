const WalletModel = require("../models/wallet.model");

exports.createWallet = async () => {
  try {
    const data = await WalletModel.create({});
    return { status: true, data };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.deposit = async function (
  walletId,
  amount,
  deposedBy,
  deposedThrough,
  depositTransactionId
) {
  try {
    const data = await WalletModel.findById(walletId);

    data.balance = parseFloat(data.balance) + parseFloat(amount);
    data.history.set(Date.now(), {
      operation: "deposit",
      amount,
      deposedBy,
      deposedThrough,
      depositTransactionId,
    });
    await data.save();

    return { status: true, message: "Wallet updated successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.withdraw = async function (amount, withdrawLectureId) {};
