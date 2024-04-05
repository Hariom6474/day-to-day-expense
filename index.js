const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoute");
const mainRoutes = require("./routes/mainRoutes");
const user = require("./models/user");
const userExpense = require("./models/userExpense");
const orders = require("./models/order");
const forgotPassword = require("./models/forgetPasswordRequest");
const purchaseRoutes = require("./routes/purchaseRoute");
const premiumRoutes = require("./routes/premiumRoute");
const forgotRoute = require("./routes/forgot");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

app.use("/user", userRoutes);
app.use("/user", mainRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotRoute);

user.hasMany(userExpense);
userExpense.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user);

user.hasMany(forgotPassword);
forgotPassword.belongsTo(user);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("app is listening to port ", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
