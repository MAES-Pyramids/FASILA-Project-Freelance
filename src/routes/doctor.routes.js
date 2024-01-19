const DoctorController = require("../controllers/doctor.controller");
const router = require("express").Router();

router
  .route("/")
  .get(DoctorController.getDoctors)
  .post(DoctorController.createDoctor);

module.exports = router;
