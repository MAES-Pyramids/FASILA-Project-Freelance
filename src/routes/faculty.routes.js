const FacultyController = require("../controllers/faculty.controller");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");
const {
  CreateF_Validation,
  GetFByID_Validation,
} = require("../validations/faculty.validation");
const router = require("express").Router({ mergeParams: true });
// ----------------- Student Routes ----------------- //

// ------------------ Admin Routes ------------------ //
router
  .route("/")
  .get(FacultyController.getALLFaculties)
  .post(SetFacultyUnivID, CreateF_Validation, FacultyController.addFaculty);
router.get("/:id", GetFByID_Validation, FacultyController.getFaculty);

module.exports = router;
