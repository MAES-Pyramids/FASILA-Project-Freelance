const {
  CreateDoc_Validation,
  GetDocByID_Validation,
  GetAllDocs_Validation,
} = require("../validations/doctor.validation");
const upload = require("../middlewares/multer");
const StudentRoutes = require("./student.routes");
const SubjectRoutes = require("./subject.routes");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const { DoctorController } = require("../controllers/doctor.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router.use(requireUser);

// Marking or unmarking a doctor as a favorite for a student
router.use("/:doctorId/Student", restrictedTo("Student"), StudentRoutes);
// Getting all Doctor lectures for student
router.use(
  "/:doctorId/Subjects",
  restrictedTo("Student", "Admin"),
  SubjectRoutes
);

router
  .route("/")
  .get(
    restrictedTo("Admin"),
    GetAllDocs_Validation,
    DoctorController.getDoctors
  )
  .post(
    restrictedTo("Admin"),
    upload.array("photo"),
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

router
  .route("/:id/earning")
  .get(restrictedTo("Admin", "Doctor"), DoctorController.getDoctorEarnings);

module.exports = router;
