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
    description: {
      type: String,
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
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    finalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: this.confirmed == true,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    no_purchases: {
      type: Number,
      default: 0,
    },
    no_slides: {
      type: Number,
    },
    preview_path: {
      type: String,
    },
    waterMarkDetails: {
      spaceBetweenCharacters: {
        type: Number,
        default: 15,
      },
      opacity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.4,
      },
    },
  },
  {
    timestamps: true,
  }
);

LectureSchema.pre("save", function (next) {
  let lecture = this;
  if (lecture.confirmed)
    lecture.isFree = lecture.finalPrice == 0 ? true : false;
  next();
});
//-------------------------Export-----------------------//
const Lecture = mongoose.model("Lecture", LectureSchema);
module.exports = Lecture;
