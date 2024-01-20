const DoctorController = require("../controllers/doctor.controller");
const router = require("express").Router();

router
  .route("/")
  .get(DoctorController.getDoctors)
  .post(DoctorController.addDoctor);

router.route("/:id").get(DoctorController.getDoctorById);

module.exports = router;
