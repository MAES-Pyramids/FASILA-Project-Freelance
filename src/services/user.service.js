const _ = require("lodash");
const StudentModel = require("../models/student.model");
const LibraryModel = require("../models/library.model");
const DoctorModel = require("../models/doctor.model");
const AdminModel = require("../models/admin.model");
const models = [AdminModel, LibraryModel, DoctorModel, StudentModel];

exports.validatePassword = async function (phone, password) {
  try {
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
  } catch (err) {
    return [false, null];
  }
};

const findAndOmitPassword = async (model, query) => {
  try {
    const foundUser = await model.findOne(query).lean();
    if (!foundUser) return { status: false, message: "User not found" };

    const userWithoutPassword = _.omit(foundUser, "password");

    return { status: true, data: userWithoutPassword };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.findUser = async function (role, query) {
  switch (role) {
    case "Student":
      return findAndOmitPassword(StudentModel, query);
    case "Doctor":
      return findAndOmitPassword(DoctorModel, query);
    case "Library":
      return findAndOmitPassword(LibraryModel, query);
    case "Admin":
      return findAndOmitPassword(AdminModel, query);
    default:
      return { status: false, message: "Invalid role" };
  }
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
