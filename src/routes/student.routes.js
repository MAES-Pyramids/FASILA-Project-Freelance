const {
  Signup_Validation,
  StudentID_Validation,
  ChangePass_Validation,
  SaveTelID_Validation,
  VerifyTelID_Validation,
} = require("../validations/student.validation");
const StudentController = require("../controllers/student.controller");
const requireUser = require("../middlewares/userRequired");
const router = require("express").Router();

router.get(
  "/mobile/:mobileNumber",
  StudentID_Validation,
  StudentController.getStudentId
);

router.patch(
  "/password/:resetToken",
  ChangePass_Validation,
  StudentController.changePassword
);

router.post("/signup", Signup_Validation, StudentController.signUp);

router.use(requireUser);
router
  .route("/TelegramID")
  .post(SaveTelID_Validation, StudentController.SaveID)
  .patch(VerifyTelID_Validation, StudentController.verifyID);

module.exports = router;
