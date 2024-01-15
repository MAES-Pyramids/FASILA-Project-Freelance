const {
  CreateF_Validation,
  GetFByID_Validation,
} = require("../validations/faculty.validation");
const FacultyController = require("../controllers/faculty.controller");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", GetFByID_Validation, FacultyController.getALLFaculties);
router.get("/:id", FacultyController.getFaculty);

router.post(
  "/",
  SetFacultyUnivID,
  CreateF_Validation,
  FacultyController.addFaculty
);

module.exports = router;
