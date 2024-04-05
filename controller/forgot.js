const path = require("path");
const { createTransport } = require("nodemailer");
const User = require("../models/user");
const Forgot = require("../models/forgetPasswordRequest");
require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");

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
      const id = uuid.v4();
      await Forgot.create({ id, active: true, userId: user.id });
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
        subject: "Reset password link",
        text: "Link",
        html: `<h3>Click on this link to reset your password</h3>
        <a href="http://localhost:3000/password/resetPassword/${id}">Reset password</a>`,
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

exports.getResetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = await Forgot.findOne({ where: { id } });
    if (request && request.active === true) {
      await request.update({ active: false });
      res.status(200).send(`<html>
                              <form action="/password/updatePassword/${id}" method="post" onsubmit="formsubmitted(event)>
                                  <label for="newpassword">Enter New Password</label>
                                  <input name="newpassword" type="password" required></input>
                                  <button>Reset password</button>
                              </form>
                              <script>
                                  function formsubmitted(e){
                                      e.preventDefault();
                                      console.log('called')
                                  }
                              </script>
                            </html>`);
    } else {
      throw new Error("Something went wrong!, resend your mail");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err, message: "error1" });
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.body;
    const { updateId } = req.params;
    const request = await Forgot.findOne({ where: { id: updateId } });
    if (!request) {
      throw new Error("Invalid request Id");
    }
    const user = await User.findOne({ where: { id: request.userId } });
    if (!newpassword) {
      return res
        .status(401)
        .json({ success: false, error: "password is required" });
    }
    if (user) {
      bcrypt.hash(newpassword, 10, async (err, hash) => {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        await user.update({ password: hash });
        res.status(201).json({ message: "New password updated successfully!" });
      });
    } else {
      return req
        .status(404)
        .json({ success: false, error: "no user exist", message: "error2" });
    }
  } catch (err) {
    console.log(err);
    return res.status(403).json({ err, success: false, message: "error3" });
  }
};
