const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/auth");
const premiumController = require("../controller/premiumControl");

router.get(
  "/showLeaderboard",
  userAuthentication.authenticate,
  premiumController.getLeaderboard
);

module.exports = router;
