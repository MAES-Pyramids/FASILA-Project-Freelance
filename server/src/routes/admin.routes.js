const {
  createAdmin,
  getAllAdmins,
} = require("../validations/admin.validation");
const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");
const adminController = require("../controllers/admin.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router.use(requireUser);
router.use(restrictedTo("Admin"));

router
  .route("/")
  .post(createAdmin, adminController.addAdmin)
  .get(getAllAdmins, adminController.getAdmins);

module.exports = router;
