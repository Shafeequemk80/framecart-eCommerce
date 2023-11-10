const bctypt = require("bcrypt");
const User = require("../model/userModel");
const Category = require("../model/category");
const Products = require("../model/productsModel");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");
const { token } = require("morgan");

const securePassword = async (password) => {
  try {
    const passwordHash = bctypt.hash(password, 10);
    return passwordHash;
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
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const  verifylogin = async (req, res) => {
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
          res.redirect("/admin/dashboard");
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

const loaddashboard = async (req, res) => {
  try {

    res.render("dashboard");
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
    console.log(userData);
    if (userData) {
      const randomString = randomstring.generate();

      const tokenData = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      sendResetVerifyMail("admin", userData.email, randomString);
      res.render("forgetpassword", { message: "please check your mail" });
    } else {
      res.render("forgetpassword", { message: "not found account" });
    }
  } catch (error) {}
};

const loadreset =async (req,res)=>{


  try {
    
const token=req.query.token
const tokenData= await User.findOne({token:token})
if (tokenData) {
  res.render("resetpassword",{user_id:tokenData._id})
} else {
  res.render("404")
}

  } catch (error) {
    console.log(error.message);
  }
}


const verifyreset=async (req,res)=>{

  try {
    const password= req.body.password;
    const user_id=req.body.user_id;

    const spassword=await securePassword(password);
      const updateData=await User.updateOne({_id:user_id},{$set:{password:spassword,token:""}});
      if (updateData) {
    res.redirect("/");
      } else {
        res.render("resetpassword",{message:"passwrod reset not success"})
      }


  } catch (error) {
    console.log(error.message);
  }
}


const customerload=async(req,res)=>{
try {
 
  const userData =  await User.find()
  res.render("customers",{users:userData})
} catch (error) {
  console.log(error.message);
}
}
const logout=async(req,res)=>{
  try {
    
req.session.destroy();
res.redirect("/admin")

  } catch (error) {
    console.log(error.message);
  }
}


const loadproducts =async (req,res)=>{
  
  const productData= await Products.find()
res.render("products",{products:productData,})

try {
  
} catch (error) {
  console.log(error.message);
}
}

const loadorders =async (req,res)=>{

  try {
    res.render("orders")

  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  loadLogin,
  verifylogin,
  loaddashboard,
  loadforget,
  verifyforget,
  loadreset,
  verifyreset,
  customerload,
  logout,
  loadproducts,
  loadorders,

};
