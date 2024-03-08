const mongoose = require("mongoose");
const PLecture = require("./purchase.model");
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

LectureSchema.set("toObject", { virtuals: true });
LectureSchema.set("toJSON", { virtuals: true });
LectureSchema.virtual("no_purchases");

LectureSchema.post(/^find/, async function (doc) {
  if (doc) {
    if (Array.isArray(doc)) {
      doc.forEach(async (el) => {
        if (el.key) {
          el.path = await s3GetTempViewURL(el.key, "application/pdf");
        }
        el.no_purchases = await PLecture.countDocuments({ lecture: el._id });
      });
    } else if (!Array.isArray(doc)) {
      if (doc.key) {
        doc.path = await s3GetTempViewURL(doc.key, "application/pdf");
      }
      doc.no_purchases = await PLecture.countDocuments({ lecture: doc._id });
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
