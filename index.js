const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const port = 3000;

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoute");
const mainRoutes = require("./routes/mainRoutes");
const user = require("./models/user");
const userExpense = require("./models/userExpense");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

app.use("/user", userRoutes);
app.use("/user", mainRoutes);

user.hasMany(userExpense);
userExpense.belongsTo(user);

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
