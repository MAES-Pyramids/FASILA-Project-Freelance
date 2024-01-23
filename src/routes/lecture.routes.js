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
  .route("/:id")
  .get(LectureController.getLectureById)
  .patch(restrictedTo("Doctor"), LectureController.confirmLecture)
  .delete(restrictedTo("Doctor"), LectureController.deleteLecture);

module.exports = router;
