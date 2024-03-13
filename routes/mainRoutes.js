const express = require("express");
const userControl = require("../controller/userControl");

const router = express.Router();

router.post("/add-expense", userControl.postAddExpense);
router.get("/get-expense", userControl.getAddExpense);
router.delete("/delete-expense/:id", userControl.postDeleteExpense);

module.exports = router;
