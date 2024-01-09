const StudentController = require("../controllers/student.controller.js");
const StudentJV = require("../validations/student.validation.js");
const validation = require("../middlewares/validation.js");

const router = require("express").Router();

router.post("/signup", StudentController.signUp);

router
  .route("/:studentId/TelegramID")
  .put(StudentController.SaveID)
  .post(StudentController.verifyID);

router.get("/:studentId/SendOTP", StudentController.SendOTP);

module.exports = router;
