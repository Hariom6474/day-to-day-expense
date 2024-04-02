const express = require("express");
const forgotController = require("../controller/forgot");
const loginController = require("../controller/loginControl");
const router = express.Router();

router.get("/forgotPassword", forgotController.getForgotPassword);
router.get("/login", loginController.getLoginpage);

module.exports = router;
