const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const DownloadedExpense = sequelize.define("downloadedExpense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileURL: {
    type: Sequelize.STRING,
    unique: true,
    validate: { isUrl: true },
    allowNull: false,
  },
});

module.exports = DownloadedExpense;
