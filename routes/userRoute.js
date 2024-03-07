const express = require("express");
const controller = require("../controller/main");
const router = express.Router();

router.get("", controller.getSchedulepage);
router.post("/sign-up", controller.postAddIndex);

module.exports = router;
