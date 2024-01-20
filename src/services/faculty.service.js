const facultyModel = require("../models/faculty.model");
const { isUniversityExist } = require("./university.service");
const _ = require("lodash");

exports.getFaculties = async function () {
  try {
    const faculties = await facultyModel
      .find()
      .populate("doctorsCount")
      .populate("subjectsCount")
      .select("-__v");
    return { status: true, data: faculties };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.getFacultyByID = async function (id) {
  try {
    const faculty = await facultyModel
      .findById(id)
      .populate("doctors", "name photo -_id -faculty")
      .populate("subjects", "name photo -_id -faculty")
      .select("-__v");
    if (!faculty) return { status: false, message: "Faculty Not Found" };
    else return { status: true, data: faculty };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.createFaculty = async function (newFaculty) {
  try {
    const isUniversity = await isUniversityExist(newFaculty.UniversityID);
    if (!isUniversity)
      return { status: false, message: "University Not Found" };

    const newFacultyData = _.omit(newFaculty, ["UniversityID"]);
    const faculty = await facultyModel.create(newFacultyData);

    return { status: true, data: faculty };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isValidSemester = async function (facultyID, semester) {
  try {
    const faculty = await facultyModel.findById(facultyID);
    if (!faculty) return { status: false, message: "Faculty Not Found" };

    if (semester > faculty.no_of_semesters)
      return { status: false, message: "Invalid semester number" };

    return { status: true, message: "Valid semester number" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.isFacultyExist = async function (id) {
  try {
    const faculty = await facultyModel.findById(id);
    if (!faculty) return false;
    return true;
  } catch (err) {
    return false;
  }
};
