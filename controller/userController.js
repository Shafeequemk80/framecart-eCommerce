const bctypt = require("bcrypt");
const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");
const { token } = require("morgan");
const e = require("express");

function generateAndStoreOTP(req) {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });

  const otpGenTime = Date.now() / 1000;
  const otpExrTime = otpGenTime + 45;

  req.session.otp = {
    code: otp,
    expiry: otpExrTime,
  };

  return otp; // Return the generated OTP if needed
}
const securePassword = async (password) => {
  try {
    const passwordHash = await bctypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const sendVerifyMail = async (email, name, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.passwordUser,
      },
    });

    const mailOption = {
      from: "shafeequemk80@gmail.com",
      to: email,
      subject: "One-Time Password for Verifying Your Account",
      html: `
      <div class="otp-container" style="width: 300px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
        <h2 class="otp-title" style="font-size: 24px; font-weight: bold; text-align: center;">One-Time Password</h2>
        <p class="otp-message" style="font-size: 16px; text-align: center;">Hai ${name} Please use the following OTP to verify your account:</p>
        <span class="otp-code" style="font-size: 24px; font-weight: bold; text-align: center justify-content center;">${otp}</span>
      </div>
    `,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("you mail has been send", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sendResetVerifyMail = async (fullname, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.passwordUser,
      },
    });

    const mailOption = {
      from: "shafeequemk80@gmail.com",
      to: email,
      subject: "One-Time Password for restting your Your password",
      html:
        "<p>Hai " +
        fullname +
        ', Please Click here to <a href="http://localhost:3000/resetpassword?token=' +
        token +
        '"> reset </a> Your password</p>',
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("you mail has been send", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadregister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};

const insestUser = async (req, res) => {
  try {
    
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      res.render("signup", { message: "this mail already send" });
    } else {
      req.session.username = req.body.username;
      req.session.firstname = req.body.firstname;
      req.session.lastname = req.body.lastname;
      req.session.email = req.body.email;
      req.session.mobile = req.body.mobile;
      req.session.password = req.body.password;
      req.session.fullname=`${req.body.firstname} ${req.body.lastname}`
      if (req.body.password === req.body.password_2) {
        const generatedOTP = generateAndStoreOTP(req);

        sendVerifyMail(req.session.email, req.session.firstname, generatedOTP);

        res.render("verify", {
          name: "Please enter the one-time password to verify your account",
          mail: req.session.email,
        });
      } else {
        res.render("login", { message: "Enter same password" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const loadverifyotp = async (req, res) => {
  try {
    res.render("verify");
  } catch (error) {
    console.log(error.message);
  }
};

const checkotp = async (req, res) => {
  try {
    const verifyotp = req.body.otp;

    const currTime = Math.floor(Date.now()) / 1000;

    if (currTime <= req.session.otp.expiry) {
      if (req.session.otp.code == verifyotp) {
        res.redirect("email-verified");
        const spassword = await securePassword(req.session.password);
        const user = new User({
          username: req.session.username,
          firstname: req.session.firstname,
          lastname: req.session.lastname,
          email: req.session.email,
          password: spassword,
          mobile: req.session.mobile,
          fullname: req.session.fullname,
        });
      
        const userData = await user.save();
        console.log(userData);
        if (userData) {
          req.session.user_id = userData._id;
        }
      } else {
        res.render("verify", { message: "OTP is ivalid" });
      }
    } else {
      res.render("verify", { message: "OTP is exprired Resend Otp" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resend = async (req, res) => {
  try {
    const generatedOTP = generateAndStoreOTP(req);
    console.log(generatedOTP);
    const fullname = req.session.fullname;
    sendVerifyMail(req.session.email, fullname, generatedOTP);

    res.render("verify");
  } catch (error) {
    console.log(error.message);
  }
};
const confimverify = async (req, res) => {
  try {
    res.render("email-verified");
  } catch (error) {
    console.log(error.message);
  }
};
const loadlogin = async (req, res) => {
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

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bctypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("login", { message: "your mail or password incorrect" });
      }
    } else {
      res.render("login", { message: "your mail or password incorrect" });
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

const loadforget = async (req, res) => {
  try {
    res.render("forgetpassword");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyforget = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      const addtoken = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      sendResetVerifyMail(userData.fullname, userData.email, randomString);
      res.render("forgetpassword", { message: "please check your mail" });
    } else {
      res.render("forgetpassword", { message: "user mail is incorect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadreset = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("resetpassword", { user_id: tokenData._id });
    } else {
      res.render(404);
    }
  } catch (error) {
    console.log(error.message);
  }
};
const resetpassword = async (req, res) => {

  console.log(req.body.user_id);
  const password = req.body.password;
  const user_id = req.body.user_id
  
  const spassword = await securePassword(password);

  const updateData = await User.updateOne(
    { _id: user_id },
    { $set: { password: spassword, token: "" } }
  );

  res.redirect("/");
};

module.exports = {
  loadregister,
  insestUser,
  sendVerifyMail,
  loadverifyotp,
  checkotp,
  confimverify,
  loadlogin,
  verifylogin,
  loadHome,
  loadforget,
  verifyforget,
  resend,
  loadreset,
  resetpassword,
};
