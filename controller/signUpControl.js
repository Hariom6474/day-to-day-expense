const User = require("../models/user");

exports.getSignUppage = async (req, res, next) => {
  await res.sendFile("signUp.html", { root: "views" });
};

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.postSignUp = async (req, res, next) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      return res
        .status(400)
        .json({ error: "Bad parameters, something is missing." });
    }
    const existingUser = await User.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const data = await User.create({
        name: name,
        email: email,
        password: password,
      });
      console.log(data);
      return res.redirect("/user/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
