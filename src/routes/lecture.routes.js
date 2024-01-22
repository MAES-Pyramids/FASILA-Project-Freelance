const LectureController = require("../controllers/lecture.controller");
const router = require("express").Router({ mergeParams: true });

// router
//   .route("/")
//   .get(LectureController.getLectures)
//   .post(LectureController.addLecture)
//   .patch(LectureController.confirmLecture);

module.exports = router;
