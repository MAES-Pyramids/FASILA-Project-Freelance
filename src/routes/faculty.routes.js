const FacultyController = require("../controllers/faculty.controller");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");
const {
  CreateF_Validation,
  GetFByID_Validation,
} = require("../validations/faculty.validation");
const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .get(FacultyController.getALLFaculties)
  .post(SetFacultyUnivID, CreateF_Validation, FacultyController.addFaculty);

router
  .route("/:id")
  .get(GetFByID_Validation, FacultyController.getFaculty)
  .patch()
  .delete();

module.exports = router;
