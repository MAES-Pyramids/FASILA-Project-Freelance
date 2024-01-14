const wasageController = require("../controllers/wasage.controller");
const express = require("express");

const router = express.Router();

router.get("/", wasageController.sendOTP);

module.exports = router;
