const {
  CreateF_Validation,
  GetFByID_Validation,
  GetAllFs_Validation,
} = require("../validations/faculty.validation");
const requireUser = require("../middlewares/userRequired");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");
const FacultyController = require("../controllers/faculty.controller");
//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

router
  .route("/")
  .get(GetAllFs_Validation, FacultyController.getALLFaculties)
  .post(SetFacultyUnivID, CreateF_Validation, FacultyController.addFaculty);

router.route("/:id").get(GetFByID_Validation, FacultyController.getFaculty);

module.exports = router;
