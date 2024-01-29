const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Please provide student"],
  },
});
//-------------------------Export-----------------------//
const Wallet = mongoose.model("Wallet", WalletSchema);
