const path = require("path");
const { createTransport } = require("nodemailer");
const User = require("../models/user");
require("dotenv").config();

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

exports.postForgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const transporter = createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: "hariomtiwari6474@gmail.com",
          pass: process.env.SMTP_KEY,
        },
      });
      const mailOptions = {
        from: "hariomtiwari6474@gmail.com",
        to: email,
        subject: "sample subject",
        text: "sample text",
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email Sent" + info.response);
        }
      });
      return res
        .status(200)
        .json({ message: "Email sent successfully", success: true });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    console.error("Error in postForgotPassword:", err);
    if (err.response && err.response.status === 401) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Check API key.", success: false });
    } else {
      return res.status(500).json({
        message: err.message || "Internal server error",
        success: false,
      });
    }
  }
};
