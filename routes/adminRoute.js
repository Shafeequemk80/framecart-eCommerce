const express = require("express");
const admin_route = express();
const adminController = require("../controller/adminController");
const session = require("express-session");
const user = require("../model/model");
const path = require("path");
const  config  = require("../config/config");

admin_route.use(
    session({
      secret:config.sessionSecret, 
      resave: false,
      saveUninitialized: true,
    })
  );
  admin_route.set("view engine", "ejs");
  admin_route.set("views", path.join(__dirname, "../views/admin"));
  admin_route.use(express.static(path.join(__dirname, "public")));

  admin_route.get("/",adminController.loadLogin);
  admin_route.post("/",adminController.verifylogin);
  admin_route.get("/home",adminController.loadHome)


  module.exports=admin_route