const UniversityController = require("../controllers/university.controller");
const FacultyRoutes = require("./faculty.routes");
const UniversityJV = require("../validations/university.validation.js");

const router = require("express").Router();
router.use("/:UniversityID/Faculties", FacultyRoutes);

router
  .route("/")
  .get(UniversityController.getALLUniversities)
  .post(UniversityController.addUniversity);

router.get("/:id", UniversityController.getUniversity);

module.exports = router;
