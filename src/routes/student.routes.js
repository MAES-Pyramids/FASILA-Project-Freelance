const StudentController = require("../controllers/student.controller.js");
const StudentJV = require("../validations/student.validation.js");
const validation = require("../middlewares/validation.js");

const router = require("express").Router();

router.post("/signup", StudentController.signUp);
router.get("/SendOTP/:studentId", StudentController.SendOTP);
router.post("/StoreID/:studentId", StudentController.SaveID);
router.post("/verifyID/:studentId", StudentController.verifyID);

module.exports = router;
