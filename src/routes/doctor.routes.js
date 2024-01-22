const {
  CreateDoc_Validation,
  GetDocByID_Validation,
  GetAllDocs_Validation,
} = require("../validations/doctor.validation");
const StudentRoutes = require("./student.routes");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const DoctorController = require("../controllers/doctor.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router.use(requireUser);

router.use("/:doctorId/Student", restrictedTo("Student"), StudentRoutes);

router
  .route("/")
  .get(
    restrictedTo("Admin"),
    GetAllDocs_Validation,
    DoctorController.getDoctors
  )
  .post(
    restrictedTo("Admin"),
    CreateDoc_Validation,
    DoctorController.addDoctor
  );

router
  .route("/:id")
  .get(
    restrictedTo("Admin"),
    GetDocByID_Validation,
    DoctorController.getDoctorById
  );

module.exports = router;
