const express = require("express");

const userAuthentication = require("../middleware/auth");
const purchaseController = require("../controller/purchase");

const router = express.Router();

router.get(
  "/premium-membership",
  userAuthentication.authenticate,
  purchaseController.purchasePremium
);
router.post(
  "/updateTransactionStatus",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
