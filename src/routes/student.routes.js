const {
  Signup_Validation,
  SaveTelID_Validation,
  StudentID_Validation,
  ChangePass_Validation,
  VerifyTelID_Validation,
  AddFavDoctor_Validation,
  RemoveFavDoctor_Validation,
  EditPhoneNumber_Validation,
  ActivateAndSuspend_Validation,
} = require("../validations/student.validation");
const upload = require("../middlewares/multer");
const WalletRouter = require("./wallet.routes");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const StudentController = require("../controllers/student.controller");
//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

router.post(
  "/signup",
  upload.array("facultyCard"),
  Signup_Validation,
  StudentController.signUp
);

router
  .route("/public")
  .get(StudentID_Validation, StudentController.getStudentId)
  .patch(ChangePass_Validation, StudentController.changePassword);

router
  .route("/public/:id")
  .patch(EditPhoneNumber_Validation, StudentController.editPhoneNumber);

router.use(requireUser);

router
  .route("/favorites")
  .get(StudentController.gatFavoritesDoctors)
  .patch(AddFavDoctor_Validation, StudentController.addFavoriteDoctor)
  .delete(RemoveFavDoctor_Validation, StudentController.removeFavoriteDoctor);

router
  .route("/TelegramID")
  .post(SaveTelID_Validation, StudentController.SaveID)
  .patch(VerifyTelID_Validation, StudentController.verifyID);

router.use("/wallet", WalletRouter);
router.use("/:studentId/wallet", restrictedTo("Admin"), WalletRouter);

router
  .route("/")
  .get(restrictedTo("Admin"), StudentController.getStudents)
  .delete(restrictedTo("Student"), StudentController.deleteStudent);

router.patch(
  "/:id",
  restrictedTo("Admin"),
  ActivateAndSuspend_Validation,
  StudentController.activateAndSuspendStudent
);

module.exports = router;
