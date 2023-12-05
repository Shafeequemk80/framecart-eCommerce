const express = require("express");
const admin_route = express();
const adminController = require("../controller/adminController");
const customersCrontroller = require("../controller/customersController");
const productsCrontroller = require("../controller/productsController");
const categoryCrontroller = require("../controller/categoryController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
const auth = require("../middleware/adminAuth");
const config = require("../config/config");
const multer=require("../controller/multerController")



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

admin_route.get("/", auth.isLogout, adminController.loadLogin);
admin_route.post("/", adminController.verifylogin);
admin_route.get("/dashboard", auth.islogin, adminController.loaddashboard);
admin_route.get("/forgetpassword", adminController.loadforget);
admin_route.post("/forgetpassword", adminController.verifyforget);
admin_route.get("/resetpassword", adminController.loadreset);
admin_route.post("/resetpassword", adminController.verifyreset);
admin_route.get("/customers", adminController.customerload);
admin_route.get("/logout", adminController.logout);

admin_route.get("/orders", auth.islogin, adminController.loadorders);
admin_route.get("/allorderitems",auth.islogin,adminController.allorderitems);
admin_route.post("/updateOrderStatus",auth.islogin,adminController.updateOrderStatus)

admin_route.get("/suspenduser", auth.islogin, customersCrontroller.suspenduser);
admin_route.get("/activeuser", auth.islogin, customersCrontroller.activeuser);

admin_route.get("/products", auth.islogin, adminController.loadproducts);
admin_route.get("/addproducts", auth.islogin,productsCrontroller.addproduct);
admin_route.post("/addproducts", auth.islogin,multer.productImagesUpload,productsCrontroller.saveproduct);
admin_route.get("/editproducts", auth.islogin,productsCrontroller.editproducts);
admin_route.post("/editproducts", auth.islogin,multer.productImagesUpload,productsCrontroller.saveditproducts);
admin_route.get("/suspendproduct", auth.islogin, productsCrontroller.suspendproduct);
admin_route.get("/activeproduct", auth.islogin, productsCrontroller.activeproduct);

admin_route.get("/category", auth.islogin,categoryCrontroller.loadcategorypage)
admin_route.get("/addcategory", auth.islogin,categoryCrontroller.loadcatergory)
admin_route.post("/addcategory", auth.islogin,multer.categoryimageupload.single("image",),categoryCrontroller.savecategory)

admin_route.get("/suspendcategory", auth.islogin,categoryCrontroller.suspendcategory)
admin_route.get("/activecategory", auth.islogin,categoryCrontroller.activecategory)

module.exports = admin_route;
