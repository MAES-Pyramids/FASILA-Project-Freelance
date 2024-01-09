const FacultyController = require("../controllers/faculty.controller");
const FacultyJV = require("../validations/faculty.validation");

const express = require("express");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(FacultyController.getALLFaculties)
  .post(FacultyController.SetFacultyUniversityID, FacultyController.addFaculty);

router.route("/:id").get(FacultyController.getFaculty);

module.exports = router;
