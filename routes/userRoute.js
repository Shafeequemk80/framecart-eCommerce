const express = require("express");
const user_route = express();
const userController = require("../controller/userController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
const  config  = require("../config/config");

user_route.use(
    session({
      secret:config.sessionSecret, 
      resave: false,
      saveUninitialized: true,
    })
  );

user_route.set("view engine", "ejs");
user_route.set("views", path.join(__dirname, "../views/users"));
user_route.use("/static", express.static(path.join(__dirname, "./public")));

user_route.get("/signup",userController.loadregister);
user_route.post("/signup", userController.insestUser);

user_route.get("/verify", userController.loadverifyotp);
user_route.post("/verify",userController.checkotp)

user_route.get("/email-verified",userController.confimverify)

user_route.get("/login", userController.loadlogin),
user_route.get("/", userController.loadlogin),
user_route.post("/login", userController.verifylogin),

user_route.get("/home", userController.loadHome),

user_route.get("/forgetpassword",userController.loadforget)
user_route.post("/forgetpassword",userController.verifyforget)

user_route.get("/resend-otp",userController.resend)

user_route.get("/resetpassword",userController.loadreset)
user_route.post("/resetpassword",userController.resetpassword)

module.exports = user_route;
