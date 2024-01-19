const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    unique: true,
    required: [true, "Please provide mobile number"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  PDFsNumber: {
    type: Map,
    of: Number,
    default: {},
  },
  earning: [
    {
      value: Number,
      date: Date,
    },
  ],
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: "Faculty",
    required: [true, "Please provide faculty"],
  },
});

DoctorSchema.pre("save", async function (next) {
  let doctor = this;
  if (!doctor.isModified("password")) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.SaltWorkFactor));
  doctor.password = bcrypt.hashSync(doctor.password, salt);

  return next();
});

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
