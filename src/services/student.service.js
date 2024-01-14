const StudentModel = require("../models/student.model");

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
