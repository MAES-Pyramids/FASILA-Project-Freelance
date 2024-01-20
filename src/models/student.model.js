const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
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
    favoritesDoctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
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
  student.passwordChangedAt = Date.now() - 1000;

  return next();
});

StudentSchema.methods.comparePassword = async function (inputPassword) {
  const student = this;
  return bcrypt.compare(inputPassword, student.password).catch((err) => false);
};

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
