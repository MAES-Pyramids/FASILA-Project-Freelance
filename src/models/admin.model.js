const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide mobile number"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.pre("save", async function (next) {
  let admin = this;
  if (!admin.isModified("password")) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.SaltWorkFactor));
  admin.password = bcrypt.hashSync(admin.password, salt);

  return next();
});

AdminSchema.methods.comparePassword = async function (inputPassword) {
  const admin = this;
  return bcrypt.compare(inputPassword, admin.password).catch((err) => false);
};

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
