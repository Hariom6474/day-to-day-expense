const path = require("path");
const Expense = require("../models/userExpense");
const User = require("../models/user");
const sequelize = require("../util/database");
const UserServices = require("../services/userServices");
const S3 = require("../services/s3service");
require("dotenv").config();

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
  const t = await sequelize.transaction();
  try {
    const { Expenseamount, description, category } = req.body;
    const userId = req.user.id;
    if (Expenseamount == undefined || Expenseamount.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing!" });
    }
    const data = await Expense.create(
      {
        Expenseamount: Expenseamount,
        description: description,
        category: category,
        userId: userId,
      },
      { transaction: t }
    );
    const totalExpense = Number(req.user.totalExpenses) + Number(Expenseamount);
    await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res.status(201).json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    await t.rollback();
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
  const t = await sequelize.transaction();
  try {
    const ExpenseId = req.params.id;
    const userId = req.user.id;
    const eAmount = await Expense.findOne({ where: { id: ExpenseId, userId } });
    if (!eAmount) {
      return res.status(404).json({
        success: false,
        message: "This Expense doesnt belongs to the user",
      });
    }
    const del = await Expense.destroy(
      { where: { id: ExpenseId, userId } },
      { transaction: t }
    );
    if (del === 0) {
      return res.status(400).json({
        success: false,
        message: "Expense does not belong to the user.",
      });
    } else {
      const totalExpense =
        Number(req.user.totalExpenses) - Number(eAmount.Expenseamount);
      await User.update(
        { totalExpenses: totalExpense },
        { where: { id: req.user.id }, transaction: t }
      );
      res.sendStatus(200);
    }
    await t.commit();
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ error: err });
  }
};

exports.download = async (req, res, next) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    // console.log(expenses);
    const string = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `myexpense${userId}/${new Date()}.csv`;
    const fileURL = await S3.uploadToS3(string, filename);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};
