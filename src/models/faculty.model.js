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

FacultySchema.set("toObject", { virtuals: true });
FacultySchema.set("toJSON", { virtuals: true });

FacultySchema.virtual("doctors", {
  ref: "Doctor",
  localField: "_id",
  foreignField: "faculty",
  justOne: false,
});

FacultySchema.virtual("subjects", {
  ref: "Subject",
  localField: "_id",
  foreignField: "faculty",
  justOne: false,
});

FacultySchema.virtual("doctorsCount", {
  ref: "Doctor",
  localField: "_id",
  foreignField: "faculty",
  justOne: false,
  count: true,
});

FacultySchema.virtual("subjectsCount", {
  ref: "Subject",
  localField: "_id",
  foreignField: "faculty",
  justOne: false,
  count: true,
});

FacultySchema.virtual("university", {
  ref: "University",
  localField: "_id",
  foreignField: "faculties",
  justOne: true,
});

const Faculty = mongoose.model("Faculty", FacultySchema);
module.exports = Faculty;
