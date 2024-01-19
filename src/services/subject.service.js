const SubjectModel = require("../models/subject.model");

exports.getSubjects = async (query, excluded = "") => {
  try {
    const subjects = await SubjectModel.find(query).select(excluded);
    return { status: "success", data: subjects };
  } catch (err) {
    return { status: "error", data: err.message };
  }
};

exports.getSubjectByID = async (id, excluded = "") => {
  try {
    const subject = await SubjectModel.findById(id)
      .select(excluded)
      .populate("doctors", "photo name PDFsNumber");
    return { status: "success", data: subject };
  } catch (err) {
    return { status: "error", data: err.message };
  }
};
