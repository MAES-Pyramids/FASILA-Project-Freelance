const _ = require("lodash");
const StudentModel = require("../models/student.model");
const LibraryModel = require("../models/library.model");
const DoctorModel = require("../models/doctor.model");
const AdminModel = require("../models/admin.model");
const { parse } = require("dotenv");
const models = [AdminModel, LibraryModel, DoctorModel, StudentModel];

exports.validatePassword = async (phone, password) => {
  let { user, type } = {};

  for (const model of models) {
    user = await model.findOne({ phone });
    if (user) {
      type = model.modelName;
      break;
    }
  }
  if (!user) return false;

  const isValid = await user.comparePassword(password);
  if (!isValid) return false;

  return [_.omit(user.toJSON(), "password"), type];
};
