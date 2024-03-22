const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "daytoday_expense",
  "root",
  process.env.MYSQL_PASS,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
