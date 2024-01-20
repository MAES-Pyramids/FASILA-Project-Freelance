const _ = require("lodash");
const bcrypt = require("bcryptjs");
const OTPModel = require("../models/otp.model.js");

exports.storeOTP = async function (studentID, OTP, OTP_Type) {
  try {
    let studentOTP = await OTPModel.findOne({ student: studentID });
    if (studentOTP) await OTPModel.findByIdAndDelete(studentOTP._id);

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP.toString(), salt);

    studentOTP = await OTPModel.create({
      OTPType: OTP_Type,
      otp: hashedOTP,
      student: studentID,
    });
    return { status: true, message: "OTP stored successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.verifyOTP = async function (student, received_OTP) {
  const StoredOTP = await OTPModel.findOne({ student });
  if (!StoredOTP)
    return {
      status: false,
      message: "OTP not found",
    };

  if (!(await bcrypt.compare(received_OTP, StoredOTP.otp)))
    return {
      status: false,
      message: "OTP is incorrect",
    };

  if (StoredOTP.expiresAt < Date.now()) {
    await OTPModel.findByIdAndDelete(StoredOTP._id);
    return {
      status: false,
      message: "OTP is expired",
    };
  }

  await OTPModel.deleteMany({ student });
  return { status: true, type: StoredOTP.OTPType };
};
