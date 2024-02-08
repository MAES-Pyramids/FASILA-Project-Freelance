const mongoose = require("mongoose");
const { Worker } = require("worker_threads");
const { s3GetTempViewURL } = require("../services/digitalocean.service");

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
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Please provide the price of the lecture."],
    },
    key: {
      type: String,
    },
    path: {
      type: String,
    },
    purchasedBy: {
      type: String,
      enum: ["Student", "Library"],
      default: "Student",
    },
    purchasedAt: {
      type: Date,
      default: () => Date.now(),
    },
    emptyPageDetails: {
      addEmptyPages: {
        type: Boolean,
        default: false,
      },
      addTwoEmptyPagesAtEnd: {
        type: Boolean,
      },
      addEmptyPageAfter: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);
PurchasedLectureSchema.set("toObject", { virtuals: true });
PurchasedLectureSchema.set("toJSON", { virtuals: true });

function createWorker(
  inputFileURL,
  watermarkPhone,
  facultyCardPath,
  waterMarkDetails,
  emptyPageDetails
) {
  return new Promise((resolve, reject) => {
    const opacityString = waterMarkDetails.opacity.toString();

    const worker = new Worker("./src/utils/workerThread.js", {
      workerData: {
        inputFileURL,
        watermarkPhone,
        facultyCardPath,
        waterMarkDetails: { ...waterMarkDetails, opacity: opacityString },
        emptyPageDetails,
      },
    });
    worker.on("message", (data) => {
      if (data.status) resolve(data);
      else reject(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}
PurchasedLectureSchema.pre(/^find/, function (next) {
  this.populate({
    path: "lecture",
    select: "name description no_purchases no_slides preview_path subject",
  });
  next();
});

PurchasedLectureSchema.post(/^find/, async function (doc) {
  if (doc) {
    if (Array.isArray(doc)) {
      doc.forEach(async (el) => {
        if (el.key) el.path = await s3GetTempViewURL(el.key, "application/pdf");
      });
    } else {
      if (doc.key)
        doc.path = await s3GetTempViewURL(doc.key, "application/pdf");
    }
  }
});

PurchasedLectureSchema.pre("save", async function (next) {
  const PLecture = this;

  const { emptyPageDetails } = PLecture;
  const { path, waterMarkDetails } = (
    await PLecture.populate({ path: "lecture" })
  ).lecture;

  const { phone, facultyCard } = (
    await PLecture.populate("student", "phone facultyCard")
  ).student;

  const facultyCardPath = await s3GetTempViewURL(facultyCard, "image/png");

  try {
    const { key } = await createWorker(
      path,
      phone.slice(1),
      facultyCardPath,
      waterMarkDetails,
      emptyPageDetails
    );
    PLecture.status = "success";
    PLecture.key = key;
    next();
  } catch (err) {
    return next(new Error(`Error in creating worker thread ${err.message}`));
  }
});
//-------------------------Export-----------------------//
const PLecture = mongoose.model("PLecture", PurchasedLectureSchema);
module.exports = PLecture;
