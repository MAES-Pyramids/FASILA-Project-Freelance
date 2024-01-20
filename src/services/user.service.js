const _ = require("lodash");
const StudentModel = require("../models/student.model");
const LibraryModel = require("../models/library.model");
const DoctorModel = require("../models/doctor.model");
const AdminModel = require("../models/admin.model");
const models = [AdminModel, LibraryModel, DoctorModel, StudentModel];

exports.validatePassword = async function (phone, password) {
  let { user, type } = {};

  for (const model of models) {
    user = await model.findOne({ phone });
    if (user) {
      type = model.modelName;
      break;
    }
  }
  if (!user) return [false, null];

  const isValid = await user.comparePassword(password);
  if (!isValid) return [false, null];

  return [_.omit(user.toJSON(), "password"), type];
};

exports.findUser = async function (role, query) {
  if (role == "Student") return await StudentModel.findOne(query).lean();
  if (role == "Doctor") return await DoctorModel.findOne(query).lean();
  if (role == "Library") return await LibraryModel.findOne(query).lean();
  if (role == "Admin") return await AdminModel.findOne(query).lean();
};

const createAndOmitPassword = async (model, data) => {
  try {
    const createdUser = await model.create(data);
    const userJson = createdUser.toJSON();
    const userWithoutPassword = _.omit(userJson, "password");

    return { status: true, data: userWithoutPassword };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createUser = async function (role, data) {
  switch (role) {
    case "Student":
      return createAndOmitPassword(StudentModel, data);
    case "Doctor":
      return createAndOmitPassword(DoctorModel, data);
    case "Library":
      return createAndOmitPassword(LibraryModel, data);
    case "Admin":
      return createAndOmitPassword(AdminModel, data);
    default:
      return { status: false, message: "Invalid role" };
  }
};
