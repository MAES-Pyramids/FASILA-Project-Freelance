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
    password: {
      type: String,
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
    updatesFileKey: {
      type: String,
    },
    updatesFilePath: {
      type: String,
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
PurchasedLectureSchema.virtual("no_purchases");

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
    select: "name description no_slides preview_path subject",
  });
  next();
});

PurchasedLectureSchema.post(/^find/, async function (doc) {
  if (doc) {
    if (Array.isArray(doc)) {
      doc.forEach(async (el) => {
        if (el.key) {
          el.path = await s3GetTempViewURL(el.key, "application/pdf");
        }
        if (el.updatesFileKey) {
          el.updatesFilePath = await s3GetTempViewURL(
            el.updatesFileKey,
            "application/json"
          );
        }
        el.no_purchases = await PLecture.countDocuments({
          lecture: el.lecture,
        });
      });
    } else {
      if (doc.key) {
        doc.path = await s3GetTempViewURL(doc.key, "application/pdf");
      }
      if (doc.updatesFileKey) {
        doc.updatesFilePath = await s3GetTempViewURL(
          doc.updatesFileKey,
          "application/json"
        );
      }
      doc.no_purchases = await PLecture.countDocuments({
        lecture: doc.lecture,
      });
    }
  }
});

PurchasedLectureSchema.pre("save", async function (next) {
  const PLecture = this;
  if (!PLecture.isNew) return next();

  const { emptyPageDetails } = PLecture;
  const { path, waterMarkDetails } = (
    await PLecture.populate({ path: "lecture" })
  ).lecture;

  const { phone, facultyCard } = (
    await PLecture.populate("student", "phone facultyCard")
  ).student;
  const facultyCardPath = await s3GetTempViewURL(facultyCard, "image/png");

  try {
    console.log("Creating worker thread...");
    const { key, password } = await createWorker(
      path,
      phone.slice(1),
      facultyCardPath,
      waterMarkDetails,
      emptyPageDetails
    );
    // console.log("Received key and password from worker:", key, password);

    PLecture.status = "success";
    PLecture.password = password;
    PLecture.key = key;

    // console.log("this is the final PLecture", PLecture);

    next();
  } catch (err) {
    return next(new Error(`Error in creating worker thread ${err.message}`));
  }
});
//-------------------------Export-----------------------//
const PLecture = mongoose.model("PLecture", PurchasedLectureSchema);
module.exports = PLecture;
