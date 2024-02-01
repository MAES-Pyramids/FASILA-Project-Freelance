const {
  Signup_Validation,
  SaveTelID_Validation,
  StudentID_Validation,
  ChangePass_Validation,
  VerifyTelID_Validation,
  AddFavDoctor_Validation,
  RemoveFavDoctor_Validation,
  EditPhoneNumber_Validation,
} = require("../validations/student.validation");
const WalletRouter = require("./wallet.routes");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const StudentController = require("../controllers/student.controller");

//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

// For admin to charge wallets and for students to access their wallet history
router.use("/:id/wallet", restrictedTo("Admin", "Student"), WalletRouter);

router.post("/signup", Signup_Validation, StudentController.signUp);

router
  .route("/public")
  .get(StudentID_Validation, StudentController.getStudentId)
  .patch(ChangePass_Validation, StudentController.changePassword);

router
  .route("/public/:id")
  .patch(EditPhoneNumber_Validation, StudentController.editPhoneNumber);

router
  .route("/favorites")
  .get(requireUser, StudentController.gatFavoritesDoctors)
  .patch(
    requireUser,
    AddFavDoctor_Validation,
    StudentController.addFavoriteDoctor
  )
  .delete(
    requireUser,
    RemoveFavDoctor_Validation,
    StudentController.removeFavoriteDoctor
  );

router
  .route("/TelegramID")
  .post(requireUser, SaveTelID_Validation, StudentController.SaveID)
  .patch(requireUser, VerifyTelID_Validation, StudentController.verifyID);

module.exports = router;
