const UniversityController = require("../controllers/university.controller");
const UniversityJV = require("../validations/university.validation.js");

const router = require("express").Router();

router.route("/").get().post();

module.exports = router;
