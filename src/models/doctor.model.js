const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EarningSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Decimal128,
  date: Date,
});

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "doctor_default.jpg",
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide mobile number"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    earning: [EarningSchema],
    PDFsNumber: {
      type: Map,
      of: Number,
      default: () => ({}),
    },
    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: "Faculty",
      required: [true, "Please provide faculty"],
    },
  },
  {
    timestamps: true,
  }
);

DoctorSchema.pre("save", async function (next) {
  let doctor = this;
  if (!doctor.isModified("password")) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.SaltWorkFactor));
  doctor.password = bcrypt.hashSync(doctor.password, salt);

  return next();
});

DoctorSchema.methods.comparePassword = async function (inputPassword) {
  const doctor = this;
  return bcrypt.compare(inputPassword, doctor.password).catch((err) => false);
};
//-------------------------Export-----------------------//
const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
