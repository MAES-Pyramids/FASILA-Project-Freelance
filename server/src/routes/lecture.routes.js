const LectureController = require("../controllers/lecture.controller");
const restrictedTo = require("../middlewares/restrictedRoute");
const requireUser = require("../middlewares/userRequired");
const upload = require("../middlewares/multer");

const router = require("express").Router({ mergeParams: true });
router.use(requireUser);

router.get("/My", LectureController.getMyLectures);

router
  .route("/")
  .get(LectureController.getAllLectures)
  .post(restrictedTo("Doctor"), LectureController.addLecture);

router
  .route("/:lectureId")
  .get(restrictedTo("Student"), LectureController.byLecture)
  .patch(restrictedTo("Student"), LectureController.saveLecture)
  .post(
    restrictedTo("Admin"),
    upload.array("preview_path"),
    LectureController.confirmLecture
  );

module.exports = router;
