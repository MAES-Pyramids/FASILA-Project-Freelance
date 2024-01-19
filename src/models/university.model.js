const mongoose = require("mongoose");

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  faculties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

UniversitySchema.set("toObject", { virtuals: true });
UniversitySchema.set("toJSON", { virtuals: true });

UniversitySchema.virtual("numberOfFaculties").get(function () {
  return this.faculties?.length || 0;
});

UniversitySchema.pre("save", function (next) {
  if (this.isModified("faculties")) {
    this.numberOfFaculties = this.faculties.length;
  }
  next();
});

const University = mongoose.model("University", UniversitySchema);
module.exports = University;
