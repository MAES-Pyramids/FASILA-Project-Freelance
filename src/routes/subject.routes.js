const SubjectController = require("../controllers/subject.controller");
const router = require("express").Router({ mergeParams: true });
const {
  GetSubs_Validation,
  CreateSub_Validation,
  UpdateSub_Validation,
  GetSubByID_Validation,
} = require("../validations/subject.validation");
const { patch } = require("./wasage.routes");

router
  .route("/")
  .get(GetSubs_Validation, SubjectController.getALLSubjects)
  .post(CreateSub_Validation, SubjectController.addSubject);

router
  .route("/:id")
  .get(GetSubByID_Validation, SubjectController.getSubjectById)
  .patch(UpdateSub_Validation, SubjectController.updateSubject);

module.exports = router;
