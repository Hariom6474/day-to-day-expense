const path = require("path");

exports.user = async (req, res, next) => {
  await res.sendFile(path.join(__dirname, "../views", "user.html"), (err) => {
    if (err) {
      console.error("Error sending login.html file:", err);
      res.status(500).send("Error occurred");
    } else {
      // console.log("login.html file sent successfully");
    }
  });
};
