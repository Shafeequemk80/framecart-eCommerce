const passport = require("passport");
require("dotenv").config();
const User = require("../model/userModel");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const bcrypt = require("bcrypt"); // Import bcrypt library
const Wallet = require("../model/walletModel");
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
const success = async (req, res) => {
    try {
      // Check if the user already exists in your database based on the email
      const existingUser = await User.findOne({ email: req.user.email });
  
      if (existingUser) {
        req.session.user_id = existingUser._id;
        return res.redirect('/home');
      } else {
        const sPassword = await securePassword(req.user.id); // Await the password hashing
  
        const { givenName, familyName } = req.user.name; // Access the correct properties
        const newUser = new User({
          username: req.user.displayName, // Use displayName instead of name
          firstname: givenName,
          lastname: familyName,
          email: req.user.email,
          mobile:0,
          password: sPassword,
          fullname: `${givenName} ${familyName}`,
          google: 1,
        });
        
        const savedUser = await newUser.save();
        
        
        if (savedUser) {
          req.session.user_id = savedUser._id;
          const newWalletEntry = new Wallet({
            user: savedUser._id,
            totalAmount: 0,
          });
          await newWalletEntry.save();
          return res.redirect('/home');
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

module.exports = {
  success,
};


