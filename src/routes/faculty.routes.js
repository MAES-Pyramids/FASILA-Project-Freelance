const {
  CreateF_Validation,
  GetFByID_Validation,
  GetAllFs_Validation,
} = require("../validations/faculty.validation");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const { SetFacultyUnivID } = require("../middlewares/nestedRoutes");
const FacultyController = require("../controllers/faculty.controller");
//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

router
  .route("/")
  .get(
    restrictedTo("Admin"),
    GetAllFs_Validation,
    FacultyController.getALLFaculties
  )
  .post(
    restrictedTo("Admin"),
    SetFacultyUnivID,
    CreateF_Validation,
    FacultyController.addFaculty
  );

router
  .route("/:id")
  .get(
    restrictedTo("Admin"),
    GetFByID_Validation,
    FacultyController.getFaculty
  );

module.exports = router;
