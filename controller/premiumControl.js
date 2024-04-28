const User = require("../models/user");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const list = await User.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
