const facultyModel = require("../models/faculty.model");
const { isUniversityExist } = require("./university.service");
const _ = require("lodash");

const mapFacultyData = (faculty) => ({
  _id: faculty._id,
  name: faculty.name,
  no_of_semesters: faculty.no_of_semesters,
  university: {
    id: faculty.university._id,
    name: faculty.university.name,
  },
  doctorsCount: faculty.doctorsCount,
  subjectsCount: faculty.subjectsCount,
});

exports.getFaculties = async function (query) {
  try {
    let facultiesQuery = facultyModel
      .find()
      .populate("doctorsCount subjectsCount university");

    const faculties = await facultiesQuery.exec();

    let facultiesData = faculties.map(mapFacultyData);

    if (query.UniversityID) {
      const UNExists = await isUniversityExist(query.UniversityID);
      if (!UNExists) return { status: false, message: "University Not Found" };

      facultiesData = facultiesData.filter(
        (faculty) => faculty.university.id == query.UniversityID
      );
    }

    return { status: true, data: facultiesData };
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
