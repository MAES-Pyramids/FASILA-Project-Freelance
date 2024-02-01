const WalletController = require("../controllers/wallet.controller");

const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");

const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

router.route("/").patch(restrictedTo("Admin"), WalletController.chargeWallet);

module.exports = router;
