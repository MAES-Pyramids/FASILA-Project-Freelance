const facultyModel = require("../models/faculty.model");

exports.getFaculties = async function () {
  try {
    const faculties = await facultyModel
      .find()
      .populate("doctorsCount")
      .populate("subjectsCount")
      .select("-__v");
    return { status: true, data: faculties };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

exports.getFacultyByID = async function (id) {
  try {
    const faculty = await facultyModel
      .findById(id)
      .populate("doctors", "name photo -_id -faculty")
      .populate("subjects", "name photo -_id -faculty")
      .select("-__v");
    return { status: true, data: faculty };
  } catch (err) {
    return { status: false, data: err.message };
  }
};
