const Admin = require("../models/admin.model");
const _ = require("lodash");

exports.createAdmin = async (newAdmin) => {
  try {
    const admin = await Admin.create(newAdmin);
    const adminData = _.omit(admin.toObject(), ["password", "__v"]);
    return { status: true, data: adminData };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getAdmins = async (filter = {}) => {
  try {
    const admins = await Admin.find(filter).select("-password -__v");
    return { status: true, data: admins };
  } catch (err) {
    return { status: false, message: err.message };
  }
};
