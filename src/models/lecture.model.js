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
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
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
    finalLayout: {
      addEmptyPages: {
        type: Boolean,
        default: false,
      },
      EmptyPageDetails: {
        numEmptyPages: {
          type: Number,
          default: 1,
        },
        emptyPageHeightP: {
          type: Number,
          default: 100,
        },
        emptyPageWidthP: {
          type: Number,
          default: 50,
        },
        lineSpacing: {
          type: Number,
          default: 30,
        },
      },
      waterMarkDetails: {
        diagonalXStart: {
          type: Number,
          required: true,
        },
        diagonalYStart: {
          type: Number,
          required: true,
        },
        spaceBetweenCharacters: {
          type: Number,
          required: true,
        },
        opacity: {
          type: Number,
          default: 0.4,
        },
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

const Lecture = mongoose.model("Lecture", LectureSchema);
module.exports = Lecture;
