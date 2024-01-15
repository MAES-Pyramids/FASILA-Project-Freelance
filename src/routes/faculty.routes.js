const FacultyController = require("../controllers/faculty.controller");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");
const {
  CreateF_Validation,
  GetFByID_Validation,
} = require("../validations/faculty.validation");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", FacultyController.getALLFaculties);
router.get("/:id", GetFByID_Validation, FacultyController.getFaculty);

router.post(
  "/",
  SetFacultyUnivID,
  CreateF_Validation,
  FacultyController.addFaculty
);

module.exports = router;
