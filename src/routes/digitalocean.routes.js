const Digitalocean_Controller = require("../controllers/digitalocean.controller");
//---------------------------------------------------------------------//
const router = require("express").Router();

router.get("/PresignedURL", Digitalocean_Controller.getPresignedURL);

module.exports = router;
