const User = require("../models/user");
const path = require("path");

exports.getLoginpage = async (req, res, next) => {
  await res.sendFile(path.join(__dirname, "../views", "login.html"), (err) => {
    if (err) {
      console.error("Error sending login.html file:", err);
      res.status(500).send("Error occurred");
    } else {
      // console.log("login.html file sent successfully");
    }
  });
};

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    // console.log(email, "@@@@@@");
    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res
        .status(400)
        .json({ error: "Bad parameters, something is missing." });
    }
    const user = await User.findOne({
      where: { email: email },
    });
    // console.log(user.email, "########");
    if (user && user.email && user.email.length > 0) {
      if (user.password === password) {
        return res.redirect("/user");
      } else {
        res
          .status(401)
          .json({ message: false, message: "Email already exists" });
      }
    } else {
      res.status(404).json({ success: false, message: "user not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
