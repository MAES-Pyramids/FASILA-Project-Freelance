const {
  GetSubs_Validation,
  CreateSub_Validation,
  UpdateSub_Validation,
  GetSubByID_Validation,
} = require("../validations/subject.validation");
const requireUser = require("../middlewares/userRequired");
const upload = require("../middlewares/multer");
const lectureRoutes = require("./lecture.routes");
const restrictedTo = require("../middlewares/restrictedRoute");
const SubjectController = require("../controllers/subject.controller");
//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

// While there is a nested route for students to access lectures,it get used directly by doctors.
router.use("/:subjectId/Lectures", lectureRoutes);

router
  .route("/")
  .get(GetSubs_Validation, SubjectController.getALLSubjects)
  .post(
    restrictedTo("Admin"),
    upload.array("photo"),
    CreateSub_Validation,
    SubjectController.addSubject
  );

router
  .route("/:id")
  .get(GetSubByID_Validation, SubjectController.getSubjectById)
  .patch(
    restrictedTo("Admin"),
    UpdateSub_Validation,
    SubjectController.updateSubject
  );

module.exports = router;
