const { Login_Validation } = require("../validations/session.validation");
const SessionController = require("../controllers/session.controller");
const requireUser = require("../middlewares/userRequired");
const router = require("express").Router();

router.post("/login", Login_Validation, SessionController.login);
router.delete("/logout", requireUser, SessionController.logout);

router.use(requireUser);
router.get("/me", SessionController.getMe);

module.exports = router;
