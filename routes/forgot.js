const express = require("express");
const forgotController = require("../controller/forgot");
const loginController = require("../controller/loginControl");
const router = express.Router();

router.get("/login", loginController.getLoginpage);
router.get("/forgotPassword", forgotController.getForgotPassword);
router.use("/forgotPassword", forgotController.postForgotPassword);
router.get("/resetPassword/:id", forgotController.getResetPassword);
router.post("/updatePassword/:updateId", forgotController.getUpdatePassword);

module.exports = router;
