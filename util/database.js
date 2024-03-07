const Sequelize = require("sequelize");

const sequelize = new Sequelize("daytoday_expense", "root", "54321", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
