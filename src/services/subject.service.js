const SubjectModel = require("../models/subject.model");

exports.getSubjects = async (query) => {
  try {
    const subjects = await SubjectModel.find(query);
    return { status: "success", data: subjects };
  } catch (err) {
    return { status: "error", data: err.message };
  }
};

exports.getSubjectById = async (id) => {
  try {
    const subject = await SubjectModel.findById(id).populate("doctors");
    return { status: "success", data: subject };
  } catch (err) {
    return { status: "error", data: err.message };
  }
};
