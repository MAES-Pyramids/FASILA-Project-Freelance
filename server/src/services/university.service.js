const UniversityModel = require("../models/university.model");
const _ = require("lodash");

exports.getUniversities = async () => {
  try {
    const universities = (await UniversityModel.find().select("-__v")).map(
      (university) => _.omit(university.toJSON(), ["faculties"])
    );

    return { status: true, data: universities };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getUniversityByID = async (id) => {
  try {
    const university = await UniversityModel.findById(id)
      .select(" -__v")
      .populate("faculties", "name");
    if (!university) return { status: false, message: "University Not Found" };
    else return { status: true, data: university };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createUniversity = async (name) => {
  try {
    const university = await UniversityModel.create({ name });
    return { status: true, data: university };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.addFacultyToUniversity = async (universityID, facultyID) => {
  try {
    const university = await UniversityModel.findById(universityID);
    if (!university) return { status: false, message: "University Not Found" };

    university.faculties.push(facultyID);
    await university.save();

    return { status: true, data: university };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isUniversityExist = async (id) => {
  try {
    const university = await UniversityModel.findById(id);
    if (!university) return false;
    return true;
  } catch (err) {
    return false;
  }
};
