const bctypt = require("bcrypt");
const User = require("../model/model");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");

const securePassword = async (password) => {
  try {
    const passwordHash = bctypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bctypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_Admin == 0) {
          res.render("login", { message: "No account found" });
        } else {
          req.session.user_id = adminData._id;
          res.redirect("home");
        }
      } else {
        res.render("login", {
          message: "your E-mail or password is incorrect",
        });
      }
    } else {
      res.render("login", { message: "your E-mail or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  loadLogin,
  verifylogin,
  loadHome,
};
