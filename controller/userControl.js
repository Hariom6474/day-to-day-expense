const path = require("path");
const Expense = require("../models/userExpense");

exports.user = async (req, res, next) => {
  await res.sendFile(path.join(__dirname, "../views", "user.html"), (err) => {
    if (err) {
      console.error("Error sending login.html file:", err);
      res.status(500).send("Error occurred");
    } else {
      // console.log("login.html file sent successfully");
    }
  });
};

exports.postAddExpense = async (req, res, next) => {
  try {
    const { Expenseamount, description, category } = req.body;
    const userId = req.user.id;
    const data = await Expense.create({
      Expenseamount: Expenseamount,
      description: description,
      category: category,
      userId: userId,
    });
    res.status(201).json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getAddExpense = async (req, res, next) => {
  try {
    const data = await Expense.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.postDeleteExpense = async (req, res, next) => {
  try {
    const ExpenseId = req.params.id;
    const userId = req.user.id;
    const del = await Expense.destroy({ where: { id: ExpenseId, userId } });
    if (del === 0) {
      return res.status(400).json({
        success: false,
        message: "Expense does not belong to the user.",
      });
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
