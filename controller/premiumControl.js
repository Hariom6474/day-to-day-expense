const User = require("../models/user");
// const sequelize = require("sequelize");
// const Expense = require("../models/userExpense");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const list = await User.findAll({
      // include: [
      //   {
      //     model: Expense,
      //     attributes: [],
      //   },
      // ],
      // attributes: [
      //   "id",
      //   "name",
      //   [
      //     sequelize.fn("SUM", sequelize.col("Expenses.Expenseamount")),
      //     "totalExpense",
      //   ],
      // ],
      group: ["User.id"],
      order: [["totalExpenses", "DESC"]],
    });
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
