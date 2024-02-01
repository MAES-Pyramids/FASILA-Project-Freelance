const { invalidateUserSessions } = require("../services/session.service");
const { isDoctorExist } = require("../services/doctor.service");
const StudentModel = require("../models/student.model");
const crypto = require("crypto");

exports.checkValidPhone = async function (phone) {
  try {
    const student = await StudentModel.findOne({ phone });
    if (student)
      return { status: false, message: "Phone number already exists" };
    else return { status: true, message: "Phone number is valid" };
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

exports.changePhoneNumber = async function (_id, phone) {
  try {
    const student = await StudentModel.findOne({ _id, verified: false });
    if (!student)
      return { status: false, message: "Unverified Student not found" };

    student.phone = phone;
    await student.save();
    return { status: true, message: "Phone number changed successfully" };
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
    if (student.telegramStatus !== "pending")
      return { status: false, message: "Telegram ID already verified" };

    student.telegramStatus = "active";
    await student.save();

    return { status: true, message: "Telegram ID verified successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.changePassword = async function (_id, password) {
  try {
    const student = await StudentModel.findById(_id);
    if (!student) return { status: false, message: "Student not found" };

    student.password = password;
    student.resetPassToken = undefined;
    student.resetPassExpires = undefined;
    await student.save();

    return { status: true, message: "Password changed successfully" };
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

exports.getStudentsNumber = async function () {
  try {
    const studentsNumber = await StudentModel.countDocuments();
    return { status: true, data: studentsNumber };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getFavDoctors = async function (_id, semester) {
  try {
    const student = await StudentModel.findById(_id);

    const { favoritesDoctors } = await StudentModel.findById(_id)
      .populate({
        path: `favoritesDoctors.${student.semester.toString()}`,
        select: "name",
      })
      .select("favoritesDoctors");

    return { status: true, data: favoritesDoctors.get(semester.toString()) };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.addFavDoctor = async function (_id, doctorId) {
  try {
    const { status, message } = await isDoctorExist(doctorId);
    if (!status) return { status, message };

    const student = await StudentModel.findById(_id);
    const semester = student.semester.toString();

    const doctorsArray = student.favoritesDoctors.get(semester) || [];

    if (doctorsArray.includes(doctorId))
      return { status: true, message: "Doctor already added" };
    else doctorsArray.push(doctorId);

    student.favoritesDoctors.set(semester, doctorsArray);
    await student.save();

    return { status: true, message: "Doctor added successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.removeFavDoctor = async function (_id, doctorId) {
  try {
    const student = await StudentModel.findById(_id);
    const semester = student.semester.toString();

    const doctorsArray = student.favoritesDoctors.get(semester) || [];
    const index = doctorsArray.indexOf(doctorId);

    if (index > -1) doctorsArray.splice(index, 1);
    else return { status: true, message: "Doctor already removed" };

    student.favoritesDoctors.set(semester, doctorsArray);
    await student.save();

    return { status: true, message: "Doctor removed successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getStudentPaymentData = async (_id) => {
  try {
    const student = await StudentModel.findOne({ _id, verified: true });
    if (!student) return { status: false, message: "Student not found" };

    const customerData = {
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
    };

    return { status: true, customerData };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getStudentWalletId = async (_id) => {
  try {
    const student = await StudentModel.findById(_id).select("wallet");
    if (!student) return { status: false, message: "Student not found" };

    return { status: true, walletId: student.wallet._id };
  } catch (err) {
    return { status: false, message: err.message };
  }
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
