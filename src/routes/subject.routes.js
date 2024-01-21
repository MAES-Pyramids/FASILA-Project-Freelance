const {
  GetSubs_Validation,
  CreateSub_Validation,
  UpdateSub_Validation,
  GetSubByID_Validation,
} = require("../validations/subject.validation");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const SubjectController = require("../controllers/subject.controller");
//---------------------------------------------------------------------//
const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

router
  .route("/")
  .get(GetSubs_Validation, SubjectController.getALLSubjects)
  .post(
    restrictedTo("Admin"),
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
