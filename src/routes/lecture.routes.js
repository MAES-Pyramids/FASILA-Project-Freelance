const LectureController = require("../controllers/lecture.controller");
const router = require("express").Router({ mergeParams: true });

const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");

router.use(requireUser);

router
  .route("/")
  .get(LectureController.getAllLectures)
  .post(restrictedTo("Doctor"), LectureController.addLecture);

router
  .route("/:lectureId")
  .post(restrictedTo("Student"), LectureController.byLecture)
  .patch(restrictedTo("Admin"), LectureController.confirmLecture);

module.exports = router;
