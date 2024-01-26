const { string } = require("joi");
const mongoose = require("mongoose");

const PurchasedLectureSchema = new mongoose.Schema(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    transaction: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    purchasedBy: {
      type: String,
      enum: ["Student", "Library"],
      default: "Student",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    path: {
      type: String,
      validate: {
        validator: (value) => /^https?:\/\/.+/.test(value),
        message: "Invalid URL format for the document path.",
      },
    },
  },
  { timestamps: true }
);

const PurchasedLecture = mongoose.model(
  "PurchasedLecture",
  PurchasedLectureSchema
);
