const mongoose = require("mongoose");
const { Worker } = require("worker_threads");

const PurchasedLectureSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
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
      type: Number,
      required: [true, "Price is required"],
    },
    path: {
      type: String,
      validate: {
        validator: (value) => /^https?:\/\/.+/.test(value),
        message: "Invalid URL format for the document path.",
      },
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
  },
  { timestamps: true }
);
PurchasedLectureSchema.set("toObject", { virtuals: true });
PurchasedLectureSchema.set("toJSON", { virtuals: true });

PurchasedLectureSchema.pre(/^find/, function (next) {
  this.populate({
    path: "lecture",
    select: "name description no_purchases no_slides preview_path subject",
  });
  next();
});

function createWorker(inputFileURL, outputFilePath, watermarkPhone) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./src/utils/workerThread.js", {
      workerData: {
        inputFileURL,
        outputFilePath,
        watermarkPhone,
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

PurchasedLectureSchema.pre("save", async function (next) {
  const PLecture = this;
  const { path } = (await PLecture.populate("lecture", "path")).lecture;
  const { phone } = (await PLecture.populate("student", "phone")).student;

  try {
    const result = await createWorker(
      path,
      `${__dirname}/../../public/pdfs/test_1.1_modified.pdf`,
      phone.slice(1)
    );
    console.log(result);
    next();
  } catch (err) {
    return next(new Error(`Error in creating worker thread ${err.message}`));
  }
});
//-------------------------Export-----------------------//
const PurchasedLecture = mongoose.model(
  "PurchasedLecture",
  PurchasedLectureSchema
);
module.exports = PurchasedLecture;
