const SubjectController = require("../controllers/subject.controller");
const router = require("express").Router({ mergeParams: true });
// ----------------- Student Routes ----------------- //
router.get("/My", SubjectController.getMySubjects);

router
  .route("/")
  .get(SubjectController.getALLSubjects)
  .post(SubjectController.addSubject);
router.route("/:id").get(SubjectController.getSubjectById);

// ------------------ Admin Routes ------------------ //

module.exports = router;
