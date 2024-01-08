const StudentController = require("../controllers/student.controller.js");
const StudentJV = require("../validations/student.validation.js");
const validation = require("../middlewares/validation.js");

const router = require("express").Router();

router.post("/signup", StudentController.signUp);

module.exports = router;
