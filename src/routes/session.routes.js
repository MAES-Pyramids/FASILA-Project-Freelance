const SessionController = require("../controllers/session.controller");
const requireUser = require("../middlewares/userRequired");

const router = require("express").Router();

router.post("/login", SessionController.login);

router.use(requireUser);
router.get("/me", SessionController.getMe);
router.delete("/logout", SessionController.logout);

module.exports = router;
