const SessionController = require("../controllers/session.controller");

const router = require("express").Router();

router.post("/login", SessionController.login);

module.exports = router;
