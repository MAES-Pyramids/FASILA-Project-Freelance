const statisticsController = require("../controllers/statistics.controller");
const requireUser = require("../middlewares/userRequired");

const router = require("express").Router();

router.use(requireUser);

router.get("/DoctorsNumber", statisticsController.getDoctorsNumber);
router.get("/StudentsNumber", statisticsController.getStudentsNumber);
router.get("/SoldLecturesNumber", statisticsController.getSoldLecturesNumber);

module.exports = router;
