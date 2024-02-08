const mongoose = require("mongoose");
const { s3GetTempViewURL } = require("../services/digitalocean.service");

const LectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    path: {
      type: String,
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
        default: 17,
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

LectureSchema.post(/^find/, async function (doc) {
  if (doc) {
    if (Array.isArray(doc)) {
      doc.forEach(async (el) => {
        if (el.key) {
          el.path = await s3GetTempViewURL(el.key, "application/pdf");
        }
      });
    } else if (!Array.isArray(doc)) {
      if (doc.key) {
        doc.path = await s3GetTempViewURL(doc.key, "application/pdf");
      }
    }
  }
});

LectureSchema.pre("save", function (next) {
  let lecture = this;
  if (lecture.confirmed)
    lecture.isFree = lecture.finalPrice == 0 ? true : false;
  next();
});
//-------------------------Export-----------------------//
const Lecture = mongoose.model("Lecture", LectureSchema);
module.exports = Lecture;
