const express = require("express");
const user_route = express();
const userController = require("../controller/userController");
const cartController = require("../controller/cartController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
const config = require("../config/config");
const auth = require("../middleware/userAuth");
user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");
user_route.use("/static", express.static(path.join(__dirname, "./public")));

user_route.get("/login", auth.isLogout, userController.loadlogin),
  user_route.get("/", auth.isLogout, userController.loadlogin),
  user_route.post("/login", auth.isLogout, userController.verifylogin),
  user_route.get("/signup", auth.isLogout, userController.loadregister);
user_route.post("/signup", auth.isLogout, userController.insestUser);

user_route.get("/verify", userController.loadverifyotp);
user_route.post("/verify", userController.checkotp);

user_route.get("/email-verified", userController.confimverify);

user_route.get("/home", userController.loadHome),

user_route.get("/forgetpassword", auth.isLogout, userController.loadforget);
user_route.post("/forgetpassword", auth.isLogout, userController.verifyforget);

user_route.get("/resend-otp", auth.isLogout, userController.resend);

user_route.get("/resetpassword", userController.loadreset);
user_route.post("/resetpassword", userController.resetpassword);
user_route.get("/logout", auth.islogin, userController.logout);

user_route.get("/allproducts", userController.getallproducts);
user_route.get("/product", userController.getoneproduct);
user_route.get("/cart", auth.islogin, userController.loadcart);
user_route.get("/addtocart", auth.islogin, cartController.addtocart);
module.exports = user_route;
