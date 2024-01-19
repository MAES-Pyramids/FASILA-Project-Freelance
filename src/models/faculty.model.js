const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  no_of_semesters: {
    type: Number,
    required: [true, "Please provide number of semesters"],
  },
});

const Faculty = mongoose.model("Faculty", FacultySchema);
module.exports = Faculty;
