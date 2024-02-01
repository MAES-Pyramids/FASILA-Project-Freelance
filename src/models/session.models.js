const mongoose = require("mongoose");
//------------------------------------------//
const SessionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Student", "Doctor", "Admin", "Library"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//-------------------------Export-----------------------//
const Session = mongoose.model("Session", SessionsSchema);
module.exports = Session;
