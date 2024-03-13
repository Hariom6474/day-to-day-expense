const express = require("express");
const signUpController = require("../controller/signUpControl");
const loginController = require("../controller/loginControl");
const userController = require("../controller/userControl");
const router = express.Router();

router.get("/signUp", signUpController.getSignUppage);
router.post("/sign-up", signUpController.postSignUp);
router.get("/login", loginController.getLoginpage);
router.post("/login", loginController.postLogin);
router.get("", userController.user);

module.exports = router;
