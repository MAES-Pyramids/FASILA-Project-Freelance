const WalletModel = require("../models/wallet.model");

exports.createWallet = async () => {
  try {
    const data = await WalletModel.create({});
    return { status: true, data };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
