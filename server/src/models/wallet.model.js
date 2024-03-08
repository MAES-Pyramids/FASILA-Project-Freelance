const mongoose = require("mongoose");

const requiredForDeposit = function () {
  return this.operationType === "deposit";
};
const requiredForWithdraw = function () {
  return this.operationType === "withdraw";
};

const operationSchema = new mongoose.Schema({
  operationType: {
    type: String,
    enum: ["withdraw", "deposit"],
    required: [true, "Please provide operation"],
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, "Please provide operation amount"],
  },
  deposedThrough: {
    type: String,
    enum: ["Paymob", "Vodafone", "Instapay"],
    required: requiredForDeposit,
  },
  deposedBy: {
    type: String,
    enum: ["Admin", "Student"],
    required: requiredForDeposit,
  },
  withdrawLectureId: {
    type: String,
    required: requiredForWithdraw,
  },
  depositId: {
    transaction: {
      type: String,
      required: function () {
        return (
          this.operationType === "deposit" &&
          this.deposedThrough === "Paymob" &&
          this.deposedBy === "Student"
        );
      },
    },
    manually: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: function () {
        return (
          this.operationType === "deposit" &&
          this.deposedThrough !== "Paymob" &&
          this.deposedBy === "Admin"
        );
      },
    },
  },
});

const WalletSchema = new mongoose.Schema({
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0.0,
  },
  history: {
    type: Map,
    of: operationSchema,
    default: () => ({}),
  },
});
//-------------------------Export-----------------------//
const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
