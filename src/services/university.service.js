const UniversityModel = require("../models/university.model");
const _ = require("lodash");

exports.getUniversities = async () => {
  try {
    const universities = (await UniversityModel.find().select("-__v")).map(
      (university) => _.omit(university.toJSON(), ["faculties"])
    );

    return { status: true, data: universities };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

exports.getUniversityByID = async (id) => {
  try {
    const university = await UniversityModel.findById(id)
      .select(" -__v")
      .populate("faculties", "name");
    return { status: true, data: university };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

exports.addUniversity = async (name) => {
  try {
    const university = await UniversityModel.create({ name });
    return { status: true, data: university };
  } catch (err) {
    return { status: false, data: err.message };
  }
};
