const express = require("express");
const user_route = express();
const userController = require("../controller/userController");
const session = require("express-session");


const user = require("../model/model");
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
user_route.use(express.static(path.join(__dirname, "public")));

user_route.get("/signup", userController.loadregister);
user_route.post("/signup", userController.insestUser);
user_route.get("/verify",userController.loadverifyotp)
user_route.post("/verify",userController.checkotp)
user_route.get("/email-verified",userController.confimverify)
user_route.get("/login", userController.loadlogin),
user_route.post("/login", userController.verifylogin),
user_route.get("/home", userController.loadHome),


module.exports = user_route;