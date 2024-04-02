const path = require("path");

exports.getForgotPassword = async (req, res, next) => {
  await res.sendFile(
    path.join(__dirname, "../views", "forgotPassword.html"),
    (err) => {
      if (err) {
        console.error("Error sending forgotPassword.html file:", err);
        res.status(500).send("Error occurred");
      }
    }
  );
};
