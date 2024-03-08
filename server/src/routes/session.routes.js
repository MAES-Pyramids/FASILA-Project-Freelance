const { Login_Validation } = require("../validations/session.validation");
const requireUser = require("../middlewares/userRequired");
const SessionController = require("../controllers/session.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router
  .route("/")
  .post(Login_Validation, SessionController.login)
  .delete(requireUser, SessionController.logout)
  .get(requireUser, SessionController.getMe);

module.exports = router;
