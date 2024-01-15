const { CreateOTP_Validation } = require("../validations/wasage.validation");
const wasageController = require("../controllers/wasage.controller");
const router = require("express").Router();

router.post("/", CreateOTP_Validation, wasageController.getOTP);

module.exports = router;
