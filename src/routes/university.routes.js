const UniversityController = require("../controllers/university.controller");
const FacultyRoutes = require("./faculty.routes");
const {
  GetUniversityByID_Validation,
  CreateUniversity_Validation,
} = require("../validations/university.validation");

const router = require("express").Router();
router.use("/:id/Faculties", FacultyRoutes);

router.get("/", UniversityController.getALLUniversities);

router.get(
  "/:id",
  GetUniversityByID_Validation,
  UniversityController.getUniversity
);

router.post(
  "/",
  CreateUniversity_Validation,
  UniversityController.addUniversity
);

module.exports = router;
