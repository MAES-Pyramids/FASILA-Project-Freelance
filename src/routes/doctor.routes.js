const {
  CreateDoc_Validation,
  GetDocByID_Validation,
  GetAllDocs_Validation,
} = require("../validations/doctor.validation");
const requireUser = require("../middlewares/userRequired");
const DoctorController = require("../controllers/doctor.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router.use(requireUser);

router
  .route("/")
  .get(GetAllDocs_Validation, DoctorController.getDoctors)
  .post(CreateDoc_Validation, DoctorController.addDoctor);

router.route("/:id").get(GetDocByID_Validation, DoctorController.getDoctorById);

module.exports = router;
