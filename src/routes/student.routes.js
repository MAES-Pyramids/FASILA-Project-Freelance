const StudentController = require("../controllers/student.controller.js");
const { signUpValidation } = require("../validations/student.validation.js");
const requireUser = require("../middlewares/userRequired.js");

const router = require("express").Router();

router.post("/signup", signUpValidation, StudentController.signUp);
router.use(requireUser);

router
  .route("/:studentId/TelegramID")
  .put(StudentController.SaveID)
  .post(StudentController.verifyID);

router.get("/:studentId/SendOTP", StudentController.SendOTP);

module.exports = router;
