const bctypt = require("bcrypt");
const User = require("../model/model");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");

const securePassword = async (password) => {
  try {
    const passwordHash = await bctypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const otp = otpGenerator.generate(6, {
  digits: true,
  alphabets: false,
  specialChars: false,
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
});
const otpGenTime = Date().now / 1000;
const otpExrTime = otpGenTime + 45;

console.log(otp);
const sendVerifyMail = async (email, name) => {
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

const loadregister = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const insestUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    // const user = new User({
    //   req.ses: req.body.username,
    //   firstname: req.body.firstname,
    //   lastname: req.body.lastname,
    //   email: req.body.email,
    //   password: spassword,
    //   mobile: req.body.mobile,
    //   is_Admin: 0,
    // });

    if (existingUser) {
      res.render("login", { message: "this mail already send" });
    } else {
      req.session.username = req.body.username;
      req.session.firstname = req.body.firstname;
      req.session.lastname = req.body.lastname;
      req.session.email = req.body.email;
      req.session.mobile = req.body.mobile;
      req.session.password = req.body.password;


      if(req.body.password===req.body.password_2){
      const fullname = `${req.session.firstname} ${req.session.lastname}`;


      


      sendVerifyMail(req.session.email, fullname);

      res.render("verify");
    }
    else{
      res.render("login",{message:"Enter same password"})
    }
  }
  } catch (error) {
    console.log(error.message);
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

    if (otp == verifyotp) 
    
    {
     
      res.redirect("email-verified");
      const spassword = await securePassword(req.session.password);
  const user = new User({
      username: req.session.username,
      firstname: req.session.firstname,
      lastname: req.session.lastname,
      email: req.session.email,
      password: spassword,
      mobile: req.session.mobile,
     
    });
  const userData= await user.save();
  if(userData){
    req.session.user_id= userData._id
  }
}
     else {
      res.render("verify", { message: "OTP is ivalid" });
    }
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
        if (userData.is_Verified === 0) {
          res.render("login", { message: "please vefify your mail" });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/home");
        }
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

const loadHome=async (req,res)=>{

  try {
const userData=await User.findById({ _id:req.session.user_id});
    res.render("home",{user:userData})

  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  loadregister,
  insestUser,
  sendVerifyMail,
  loadverifyotp,
  checkotp,
  confimverify,
  loadlogin,
  verifylogin,
  loadHome
};
