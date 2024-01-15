const UniversityController = require("../controllers/university.controller");
const FacultyRoutes = require("./faculty.routes");

const router = require("express").Router();

router.use("/:id/Faculties", FacultyRoutes);

router
  .route("/")
  .get(UniversityController.getALLUniversities)
  .post(UniversityController.addUniversity);

router.get("/:id", UniversityController.getUniversity);

module.exports = router;
