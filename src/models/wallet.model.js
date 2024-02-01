const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  balance: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  history: {
    type: Map,
    of: {
      operation: {
        type: String,
        enum: ["withdraw", "deposit"],
        required: [true, "Please provide operation"],
      },
      amount: {
        type: Number,
        required: [true, "Please provide operation amount"],
      },
      deposedThrough: {
        type: String,
        enum: ["paymob", "vodafone", "instapay"],
        validate: {
          validator: function (value) {
            return this.operation === "deposit" ? Boolean(value) : true;
          },
          message: "Deposit way is required for deposit operation",
        },
      },
      deposedBy: {
        type: String,
        enum: ["admin", "student"],
        validate: {
          validator: function (value) {
            return this.operation === "deposit" ? Boolean(value) : true;
          },
          message: "Deposed by is required for deposit operation",
        },
      },
      transactionId: {
        type: String,
        validate: {
          validator: function (value) {
            return this.operation === "deposit" &&
              this.deposedThrough === "paymob"
              ? Boolean(value)
              : true;
          },
          message:
            "Transaction ID is required for deposit operation with Paymob",
        },
      },
    },
    default: () => ({}),
  },
});
//-------------------------Export-----------------------//
const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
