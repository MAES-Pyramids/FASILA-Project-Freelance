const { Signup_Validation } = require("../validations/student.validation");
const StudentController = require("../controllers/student.controller");
const requireUser = require("../middlewares/userRequired");
const router = require("express").Router();

router.post("/signup", Signup_Validation, StudentController.signUp);

router.get("/mobile/:mobileNumber", StudentController.getStudentID);
router.patch("/:resetToken/password", StudentController.changePassword);

router.use(requireUser);

// router
//   .route("/:studentId/TelegramID")
//   .put(StudentController.SaveID)
//   .post(StudentController.verifyID);
// router.get("/:studentId/SendOTP", StudentController.SendTelegramOTP);

module.exports = router;
