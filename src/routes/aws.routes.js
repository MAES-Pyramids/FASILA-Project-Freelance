const AWSController = require("../controllers/aws.controller");
const router = require("express").Router();

router.post("/PresignedURL/:fileName", AWSController.getPresignedURL);

module.exports = router;
