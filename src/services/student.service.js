const StudentModel = require("../models/student.model");
const crypto = require("crypto");

exports.verifyStudent = async (_id, mobile) => {
  const student = await StudentModel.findOne({ _id, verified: false });

  if (!student)
    return { status: false, message: "Student not found or actually active" };

  if (mobile != student.phone)
    return { status: false, message: "Wrong mobile number, Edit it please" };

  student.verified = true;
  await student.save();

  return { status: true, message: "Student verified successfully" };
};

exports.getPassResetToken = async function (_id) {
  const student = await StudentModel.findOne({ _id, verified: true });
  if (!student) return { status: false, message: "Student not found" };

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedRT = crypto.createHash("sha256").update(resetToken).digest("hex");

  student.resetPassToken = hashedRT;
  student.resetPassExpires = Date.now() + process.env.ResetPass_TTL * 60 * 1000;
  await student.save();

  return { status: true, message: resetToken };
};
