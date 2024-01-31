const WalletController = require("../controllers/wallet.controller");

const requireUser = require("../middlewares/userRequired");
const restrictedTo = require("../middlewares/restrictedRoute");

const router = require("express").Router({ mergeParams: true });

router.use(requireUser);

router
  .route("/:id")
  .get(restrictedTo("Student"), WalletController.getWallet)
  .patch(restrictedTo("Admin"), WalletController.updateWallet);

module.exports = router;
