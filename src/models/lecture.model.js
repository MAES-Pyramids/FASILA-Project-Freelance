const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: "Subject",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: true,
    },
    type: {
      type: String,
      enum: ["Doctor", "Library"],
      default: "Doctor",
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
    },
    publishPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    no_purchases: {
      type: Number,
      default: 0,
    },
    waterMarkLayout: {
      type: String,
      enum: ["top-left", "top-right", "bottom-left", "bottom-right"],
      default: "bottom-right",
    },
  },
  {
    timestamps: true,
  }
);

const Lecture = mongoose.model("Lecture", LectureSchema);
module.exports = Lecture;
