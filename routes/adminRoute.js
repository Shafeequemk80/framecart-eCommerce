const express = require("express");
const admin_route = express();
const adminController = require("../controller/adminController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
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

admin_route.get("/", adminController.loadLogin);
admin_route.post("/", adminController.verifylogin);
admin_route.get("/home", adminController.loadHome);
admin_route.get("/forgetpassword", adminController.loadforget);
admin_route.post("/forgetpassword", adminController.verifyforget);
admin_route.get("/resetpassword",adminController.loadreset,)
admin_route.post("/resetpassword",adminController.verifyreset)
admin_route.get("/customers",adminController.customerload)


module.exports = admin_route;
