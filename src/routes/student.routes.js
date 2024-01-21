const {
  Signup_Validation,
  StudentID_Validation,
  ChangePass_Validation,
  SaveTelID_Validation,
  VerifyTelID_Validation,
  EditPhoneNumber_Validation,
} = require("../validations/student.validation");
const requireUser = require("../middlewares/userRequired");
const StudentController = require("../controllers/student.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router
  .route("/public")
  .get(StudentID_Validation, StudentController.getStudentId)
  .patch(ChangePass_Validation, StudentController.changePassword);

router
  .route("/public/:id")
  .patch(EditPhoneNumber_Validation, StudentController.editPhoneNumber);

router.post("/signup", Signup_Validation, StudentController.signUp);

router
  .route("/TelegramID")
  .post(requireUser, SaveTelID_Validation, StudentController.SaveID)
  .patch(requireUser, VerifyTelID_Validation, StudentController.verifyID);

module.exports = router;
