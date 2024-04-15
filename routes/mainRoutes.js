const express = require("express");
const userControl = require("../controller/userControl");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.post(
  "/add-expense",
  userAuthentication.authenticate,
  userControl.postAddExpense
);
router.get(
  "/get-expense",
  userAuthentication.authenticate,
  userControl.getAddExpense
);
router.delete(
  "/delete-expense/:id",
  userAuthentication.authenticate,
  userControl.postDeleteExpense
);
router.get("/download", userAuthentication.authenticate, userControl.download);

module.exports = router;
