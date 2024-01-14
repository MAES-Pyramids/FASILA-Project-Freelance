const wasageController = require("../controllers/wasage.controller");
const express = require("express");

const router = express.Router();

router.post("/", wasageController.getOTP);

module.exports = router;
