const WalletModel = require("../models/wallet.model");
const AdminModel = require("../models/admin.model");
const _ = require("lodash");

exports.createWallet = async () => {
  try {
    const data = await WalletModel.create({});
    return { status: true, data };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getWalletTransactions = async function (walletId) {
  try {
    const wallet = await WalletModel.findById(walletId).select("history");

    const history = wallet.history;
    const sortedKeys = Array.from(history.keys()).sort((a, b) => b - a);

    const Transactions = sortedKeys.map((key) => {
      let transaction = history.get(key).toObject();

      if (transaction.operationType == "deposit")
        transaction = _.omit(transaction, ["depositId", "deposedBy"]);

      if (transaction.operationType == "withdraw")
        transaction = _.omit(transaction, ["withdrawLectureId"]);

      return {
        date: new Date(parseInt(key)).toLocaleString("en-GB"),
        transaction,
      };
    });

    return { status: true, data: Transactions };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.deposit = async function (
  walletId,
  amount,
  deposedBy,
  deposedThrough,
  depositId
) {
  try {
    const data = await WalletModel.findById(walletId);

    data.balance = (parseFloat(data.balance) + parseFloat(amount)).toFixed(1);
    data.history.set(Date.now().toString(), {
      operationType: "deposit",
      amount,
      deposedBy,
      depositId,
      deposedThrough,
    });
    await data.save();

    return { status: true, message: "Wallet updated successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.withdraw = async function (amount, withdrawLectureId) {};
