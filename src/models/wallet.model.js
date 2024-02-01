const mongoose = require("mongoose");

// Reusable validation function
const requiredForDeposit = function () {
  return this.operationType === "deposit" ? Boolean(this) : true;
};
const requiredForWithdraw = function () {
  return this.operationType === "withdraw" ? Boolean(this) : true;
};

const operationSchema = new mongoose.Schema({
  operationType: {
    type: String,
    enum: ["withdraw", "deposit"],
    required: [true, "Please provide operation"],
  },
  amount: {
    type: mongoose.Decimal128,
    required: [true, "Please provide operation amount"],
  },
  deposedThrough: {
    type: String,
    enum: ["Paymob", "Vodafone", "Instapay"],
    validate: {
      validator: requiredForDeposit,
      message: "Deposit way is required for deposit operation",
    },
  },
  deposedBy: {
    type: String,
    enum: ["Admin", "Student"],
    validate: {
      validator: requiredForDeposit,
      message: "Deposed by is required for deposit operation",
    },
  },
  withdrawLectureId: {
    type: String,
    validate: {
      validator: requiredForWithdraw,
      message: "Lecture ID is required for withdraw operation",
    },
  },
  depositId: {
    transaction: {
      type: String,
      validate: {
        validator: function (value) {
          return this.operationType === "deposit" &&
            this.deposedThrough === "Paymob" &&
            this.deposedBy === "Student"
            ? Boolean(value)
            : true;
        },
        message: "Transaction ID is required for deposit operation with Paymob",
      },
    },
    manually: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "deposedBy",
      validate: {
        validator: function (value) {
          return this.operationType === "deposit" &&
            this.deposedThrough !== "Paymob" &&
            this.deposedBy === "Admin"
            ? Boolean(value)
            : true;
        },
        message: "Manually ID is required for deposit operation with Vodafone",
      },
    },
  },
});

const WalletSchema = new mongoose.Schema({
  balance: {
    type: mongoose.Decimal128,
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
