const express = require("express");
const admin_route = express();
const adminController = require("../controller/adminController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
const auth=require("../middleware/adminAuth")
const config = require("../config/config");

admin_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);
admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");
admin_route.use(express.static(path.join(__dirname, "public")));

admin_route.get("/",auth.isLogout, adminController.loadLogin);
admin_route.post("/",adminController.verifylogin);
admin_route.get("/dashboard",auth.islogin, adminController.loaddashboard);
admin_route.get("/forgetpassword", adminController.loadforget);
admin_route.post("/forgetpassword" , adminController.verifyforget);
admin_route.get("/resetpassword",adminController.loadreset,)
admin_route.post("/resetpassword",adminController.verifyreset)
admin_route.get("/customers",adminController.customerload);
admin_route.get("/logout", adminController.logout)


module.exports = admin_route;
