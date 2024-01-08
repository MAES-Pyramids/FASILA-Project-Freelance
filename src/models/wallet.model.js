const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
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

const Wallet = mongoose.model("Wallet", walletSchema);
