const { Signup_Validation } = require("../validations/student.validation");
const StudentController = require("../controllers/student.controller");
const requireUser = require("../middlewares/userRequired");
const router = require("express").Router();

router.get("/mobile/:mobileNumber", StudentController.getStudentId);
router.patch("/pass/:resetToken", StudentController.changePassword);

router.post("/signup", Signup_Validation, StudentController.signUp);

router.use(requireUser);

router
  .route("/TelegramID")
  .post(StudentController.SaveID)
  .patch(StudentController.verifyID);

module.exports = router;
