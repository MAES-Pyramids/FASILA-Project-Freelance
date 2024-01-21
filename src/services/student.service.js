const { invalidateUserSessions } = require("../services/session.service");
const StudentModel = require("../models/student.model");
const crypto = require("crypto");

exports.checkValidPhone = async function (phone) {
  try {
    const student = await StudentModel.findOne({ phone });
    if (student)
      return { status: false, message: "Phone number already exists" };
    else return { status: true, data: "Phone number is valid" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getStudentID = async function (queryParams) {
  try {
    const query = queryParams.resetPassToken
      ? {
          ...queryParams,
          resetPassExpires: { $gt: Date.now() },
        }
      : queryParams;

    const student = await StudentModel.findOne(query).select("_id");
    if (!student) {
      return queryParams.resetPassToken
        ? {
            status: false,
            message:
              "Invalid or expired token: No matching student record was found.",
          }
        : {
            status: false,
            message:
              "No matching student record was found with this mobile number.",
          };
    } else return { status: true, _id: student._id };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.storeTelegramID = async function (_id, telegramId) {
  try {
    const student = await StudentModel.findByIdAndUpdate(
      _id,
      { telegramId, telegramStatus: "pending" },
      { new: true }
    );
    return { status: true, data: student };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.verifyTelegramID = async function (_id) {
  try {
    const student = await StudentModel.findById(_id);
    if (student.telegramId !== "pending")
      return { status: false, message: "Telegram ID already verified" };

    student.telegramStatus = "verified";
    await student.save();

    return { status: true, message: "Telegram ID verified successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.changePassword = async function (_id, password) {
  try {
    const student = await StudentModel.findByIdAndUpdate(_id, {
      password: password,
      resetPassToken: undefined,
      resetPassExpires: undefined,
    });
    if (!student) return { status: false, message: "Student not found" };
    else return { status: true, message: "Password changed successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isPassChangedAfter = async function (_id, JWT_TS) {
  const student = await StudentModel.findOne({ _id });

  if (student.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      student.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWT_TS < changedTimeStamp;
  }
  return false;
};

exports.isForceLogoutAfter = async function (_id, JWT_TS) {
  const student = await StudentModel.findOne({ _id });

  if (student.forceLogoutAt) {
    const changedTimeStamp = parseInt(
      student.forceLogoutAt.getTime() / 1000,
      10
    );
    return JWT_TS < changedTimeStamp;
  }
  return false;
};

//------------------Wasage OTP---------------------//
exports.verifyStudent = async (_id, mobile) => {
  try {
    const student = await StudentModel.findOne({ _id, verified: false });

    if (!student)
      return { status: false, message: "Student not found or actually active" };

    if (mobile != student.phone)
      return { status: false, message: "Wrong mobile number, Edit it please" };

    student.verified = true;
    await student.save();

    return { status: true, message: "Student verified successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getPassResetToken = async function (_id) {
  try {
    const student = await StudentModel.findOne({ _id, verified: true });
    if (!student) return { status: false, message: "Student not found" };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedRT = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    student.resetPassToken = hashedRT;
    student.resetPassExpires =
      Date.now() + process.env.ResetPass_TTL * 60 * 1000;
    await student.save();

    return { status: true, message: resetToken };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.forceLogout = async function (_id) {
  try {
    const { status } = await invalidateUserSessions(_id);
    if (!status) return { status: false, message: "Something went wrong" };

    await StudentModel.updateOne({ _id }, { forceLogoutAt: Date.now() });
    return { status: true, message: "Logged out successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
