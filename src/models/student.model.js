const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please provide first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please provide last name"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide phone"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please provide gender"],
    },
    semester: {
      type: Number,
      required: [true, "Please provide semester"],
    },
    facultyCard: {
      type: String,
      required: true,
      unique: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: [true, "Please provide faculty"],
    },
    favoritesDoctors: {
      type: Map,
      of: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },
      ],
      default: {},
    },
    telegramId: {
      type: String,
      default: null,
    },
    telegramStatus: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "inactive",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    resetPassToken: {
      type: String,
      select: false,
    },
    resetPassExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    forceLogoutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

StudentSchema.pre("save", async function (next) {
  let student = this;
  if (!student.isModified("password")) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.SaltWorkFactor));
  student.password = bcrypt.hashSync(student.password, salt);

  if (!student.isNew) student.passwordChangedAt = Date.now() - 1000;
  return next();
});

StudentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "wallet",
    select: "balance",
  });
  next();
});

StudentSchema.methods.comparePassword = async function (inputPassword) {
  const student = this;
  return bcrypt.compare(inputPassword, student.password).catch((err) => false);
};
//-------------------------Export-----------------------//
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
