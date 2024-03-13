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
    const data = await Expense.create({
      Expenseamount: Expenseamount,
      description: description,
      category: category,
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
    const data = await Expense.findAll();
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postDeleteExpense = async (req, res, next) => {
  try {
    const ExpenseId = req.params.id;
    await Expense.destroy({ where: { id: ExpenseId } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
