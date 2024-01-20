const UniversityController = require("../controllers/university.controller");
const FacultyRoutes = require("./faculty.routes");
const {
  GetUniversityByID_Validation,
  CreateUniversity_Validation,
  GetALLUniversities_Validation,
} = require("../validations/university.validation");

const router = require("express").Router();
router.use("/:id/Faculties", FacultyRoutes);

router
  .route("/")
  .get(GetALLUniversities_Validation, UniversityController.getALLUniversities)
  .post(CreateUniversity_Validation, UniversityController.addUniversity);

router
  .route("/:id")
  .get(GetUniversityByID_Validation, UniversityController.getUniversity);

module.exports = router;
