const {
  GetUniversityByID_Validation,
  CreateUniversity_Validation,
  GetALLUniversities_Validation,
} = require("../validations/university.validation");
const FacultyRoutes = require("./faculty.routes.js");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const UniversityController = require("../controllers/university.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();
router.use("/:id/Faculties", FacultyRoutes);

router
  .route("/")
  .get(GetALLUniversities_Validation, UniversityController.getALLUniversities)
  .post(
    requireUser,
    restrictedTo("Admin"),
    CreateUniversity_Validation,
    UniversityController.addUniversity
  );

router
  .route("/:id")
  .get(GetUniversityByID_Validation, UniversityController.getUniversity);

module.exports = router;
