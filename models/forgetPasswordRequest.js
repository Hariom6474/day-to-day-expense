const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const { v4: uuidv4 } = require("uuid");
uuidv4();

const forgetPassword = sequelize.define("forgetPassword", {
  id: {
    type: Sequelize.UUID,
    autoNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  expiresBy: Sequelize.DATE,
});

module.exports = forgetPassword;
