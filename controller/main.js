const User = require("../models/user");

exports.getSchedulepage = async (req, res, next) => {
  await res.sendFile("index.html", { root: "views" });
};

exports.postAddIndex = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const data = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(data);
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
