const { Login_Validation } = require("../validations/session.validation");
const SessionController = require("../controllers/session.controller");
const requireUser = require("../middlewares/userRequired");
const router = require("express").Router();

router.post("/login", Login_Validation, SessionController.login);

router.use(requireUser);
router.delete("/logout", SessionController.logout);
router.get("/me", SessionController.getMe);

module.exports = router;
