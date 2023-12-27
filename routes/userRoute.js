const express = require("express");
const user_route = express();
const userController = require("../controller/userController");
const cartController = require("../controller/cartController");
const session = require("express-session");
const user = require("../model/userModel");
const path = require("path");
const config = require("../config/config");
const auth = require("../middleware/userAuth");
const addressController=require("../controller/addressController")
const checkoutController=require("../controller/checkoutController")
const orderController=require("../controller/orderController")
const wishlistController = require("../controller/wishlistController");
const walletController = require("../controller/walletController");
const googleauthController= require("../controller/authController")
const passport = require('passport');
user_route.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");
user_route.use("/static", express.static(path.join(__dirname, "./public")));

user_route.get("/login", auth.isLogout, userController.loadlogin),
  user_route.get("/", userController.loadHome),
  user_route.post("/login", auth.isLogout, userController.verifylogin),
  user_route.get("/signup", userController.loadregister);
user_route.post("/signup", userController.insestUser);

user_route.get("/verify", userController.loadverifyotp);
user_route.post("/verify", userController.checkotp);
user_route.get("/verify_email_change", userController.verify_email_change);
user_route.post("/verify_email_change", userController.check_verifyemail_change);
user_route.get("/email-verified", userController.confimverify);
user_route.post("/changepassword", userController.changepassword);

user_route.get("/home", userController.loadHome),

user_route.get("/forgetpassword", auth.isLogout, userController.loadforget);
user_route.post("/forgetpassword", auth.isLogout, userController.verifyforget);

user_route.get("/resend-otp", userController.resend);

user_route.get("/resetpassword", userController.loadreset);
user_route.post("/resetpassword", userController.resetpassword);
user_route.get("/logout", auth.islogin, userController.logout);

user_route.get("/allproducts", userController.getallproducts);
user_route.get("/product", userController.getoneproduct);
user_route.get("/cart", auth.islogin, userController.loadcart);
user_route.post("/addtocart", auth.islogin, cartController.addtocart);
user_route.post("/actionincart", auth.islogin, cartController.actionincart);
user_route.get("/deletefromcart", auth.islogin, cartController.deletefromcart);
user_route.get("/profile", auth.islogin, userController.profile);
user_route.post("/editprofile", auth.islogin, userController.editprofile);
user_route.get("/address",auth.islogin,addressController.address)
user_route.post("/newaddress",auth.islogin,addressController.addnewaddress)
user_route.post("/editaddress",auth.islogin,addressController.editaddress)
user_route.get("/deleteaddress",auth.islogin,addressController.deleteaddress)


user_route.get("/loadcheckout",auth.islogin,checkoutController.loadcheckout)
user_route.get("/checkout",auth.islogin,checkoutController.getcheckout)
user_route.get("/verifycheckout",auth.islogin,checkoutController.verifycheckout)

user_route.post("/verify-payment",auth.islogin,checkoutController.verifypayment)
user_route.get("/success-payment",auth.islogin,checkoutController.paymentsuccess)
user_route.post("/verifyonlinepayment",auth.islogin,checkoutController.verifyonlinepayment)


user_route.get("/allorders",auth.islogin,orderController.allorders)
user_route.get("/vieworder",auth.islogin,orderController.vieworder)
user_route.post("/cancelorder",auth.islogin,orderController.cancelorder)
user_route.post("/returnorder",auth.islogin,orderController.returnorder)
user_route.get("/invoiceprint",auth.islogin,orderController.invoiceprint)

user_route.post("/addtowishlist",auth.islogin,wishlistController.addtowishlist)
user_route.get("/whishlist",auth.islogin,wishlistController.getwishlist)
user_route.get("/deletefromwishlist",auth.islogin,wishlistController.deletefromwishlist)

user_route.post("/changeemail",auth.islogin,userController.changeemail)

user_route.get("/wallet",auth.islogin,walletController.loadwallet)
user_route.post("/addtowallet",auth.islogin,walletController.addtowallet)
user_route.post("/verifywalletonlinepayment",auth.islogin,walletController.verifyonlinepayment)
user_route.get("/500", auth.islogin,userController.page500);

user_route.use(passport.initialize());
user_route.use(passport.session());


user_route.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

user_route.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));
user_route.get('/auth/google/success',auth.isLogout,googleauthController.success);


user_route.get('/auth/google/failure', (req, res) => {
  res.send('something failed');
});


user_route.use((req, res)=>{
  res.status(404).render('404')
})



module.exports = user_route;
