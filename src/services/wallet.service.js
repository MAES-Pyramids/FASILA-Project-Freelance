const WalletModel = require("../models/wallet.model");

exports.createWallet = async (studentId) => {
  try {
    const wallet = await WalletModel.create({ student: studentId });
    return { status: true, data: wallet };
  } catch (err) {
    return { status: false, data: err.message };
  }
};
