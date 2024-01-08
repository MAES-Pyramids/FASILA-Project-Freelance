const FacultyController = require("../controllers/faculty.controller");
const FacultyJV = require("../validations/faculty.validation");

const router = require("express").Router();

router.route("/").get().post();

module.exports = router;
