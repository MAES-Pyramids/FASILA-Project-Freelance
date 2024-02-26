const PLectureController = require("../controllers/PLecture.controller.js");
const restrictedTo = require("../middlewares/restrictedRoute.js");
const requireUser = require("../middlewares/userRequired.js");

const router = require("express").Router();
router.use(requireUser);

router
  .route("/:PLectureId")
  .get(restrictedTo("Student"), PLectureController.getPLecturePathAndPassword);

module.exports = router;
