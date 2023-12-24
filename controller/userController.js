const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productsModel");
const Category = require("../model/categoryModel");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");
const { token } = require("morgan");
const e = require("express");
const { Long } = require("mongodb");
const Wallet = require("../model/walletModel");

function generateRefferalId() {
  // Generate a random identifier (6 characters)
  const randomId = Math.random().toString(36).substring(2, 12).toUpperCase();

  return randomId;
}

function generateAndStoreOTP(req) {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });

  const otpGenTime = Date.now() / 1000;
  const otpExrTime = otpGenTime + 45;

  req.session.otp = {
    code: otp,
    expiry: otpExrTime,
  };

  return otp; // Return the generated OTP if needed
}
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const sendVerifyMail = async (email, name, otp) => {
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
      subject: "One-Time Password for Verifying Your Account",
      html: `
      <div class="otp-container" style="width: 300px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
        <h2 class="otp-title" style="font-size: 24px; font-weight: bold; text-align: center;">One-Time Password</h2>
        <p class="otp-message" style="font-size: 16px; text-align: center;">Hai ${name} Please use the following OTP to verify your account:</p>
        <span class="otp-code" style="font-size: 24px; font-weight: bold; text-align: center justify-content center;">${otp}</span>
      </div>
    `,
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

const loadregister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};

const insestUser = async (req, res) => {
  try {
    console.log(req.body, "dfdf");
    const existingUser = await User.findOne({ email: req.body.email });
    const referral = req.body.refferal;
    if (referral) {
      const existingReferrals = await User.findOne({ refferalId: referral });

      console.log(existingReferrals,"email");
    
      if (!existingReferrals) {
        // If there's no existing referral, render the signup page with an appropriate message.
        return res.json({ notMatcthrefferal: true });
      }
      // Optionally, you can add additional logic here if needed.
    }
 
    if (existingUser) {
 
      return res.json({ notMatchemail: true });
    } else {
      req.session.username = req.body.username;
      req.session.firstname = req.body.firstname;
      req.session.lastname = req.body.lastname;
      req.session.email = req.body.email;
      req.session.mobile = req.body.mobile;
      req.session.password = req.body.password;
      req.session.refferal = req.body.refferal;
      req.session.fullname = `${req.body.firstname} ${req.body.lastname}`;
      if (req.body.password === req.body.password_2) {
        const generatedOTP = generateAndStoreOTP(req);

        sendVerifyMail(req.session.email, req.session.firstname, generatedOTP);
        console.log(generatedOTP);
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ samepassword: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const loadverifyotp = async (req, res) => {
  try {
    res.render("verify");
  } catch (error) {
    console.log(error.message);
  }
};
User

const checkotp = async (req, res) => {
  try {
    const verifyotp = req.body.otp;
    const currTime = Math.floor(Date.now() / 1000);
    console.log(verifyotp);
    if (currTime <= req.session.otp.expiry) {
      if (req.session.otp.code === verifyotp) {
        const hashedPassword = await securePassword(req.session.password);
        const refferalId = generateRefferalId();
        const newUser = new User({
          username: req.session.username,
          firstname: req.session.firstname,
          lastname: req.session.lastname,
          email: req.session.email,
          password: hashedPassword,
          mobile: req.session.mobile,
          fullname: req.session.fullname,
          is_Verified: 1,
          refferalId: refferalId,
        });
        const savedUser = await newUser.save();
        const userData = await User.findOne({ email: req.session.email });

        if(req.session.refferal){
        const refferal = req.session.refferal;
        
        const reffrerData = await User.findOne({ refferalId: refferal });
        const walletData = await Wallet.findOne({ user: reffrerData._id });

        const transactionDetails = {
          transactionId: refferalId,
          transactionDate: new Date(),
          transactionDetails: "Credit",
          transactionType: "Refferal Code",
          transactionAmount: 100,
        };

        const irffered={
          clientname:req.session.username,
          createdAt:new Date(),
        }

        if (walletData) {
          walletData.totalAmount += 100;
          walletData.walletHistory.push(transactionDetails);
          walletData.ireffered.push(irffered);
          await walletData.save();
        }
      }
        const newWalletEntry = new Wallet({
          user: userData._id,
          totalAmount: 0,
        });

        await newWalletEntry.save();
        console.log(newWalletEntry);

        if (savedUser) {
          req.session.user_id = savedUser._id;
          res.json({ success: true });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Error creating user" });
        }
      } else {
        console.log("Invalid OTP");
        res.json({ invalid: true, message: "Invalid OTP" });
      }
    } else {
      res.json({ expired: true, message: "OTP has expired" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const resend = async (req, res) => {
  try {
    const generatedOTP = generateAndStoreOTP(req);
    const email = req.session.email;
    console.log(email, "email");
    const name = req.session.firstname || "";
    // Assuming sendVerifyMail is correctly implemented
    sendVerifyMail(email, name, generatedOTP);

    console.log(`Resent OTP to ${email} for user ${name}`);

    res.json({ resendsuccess: true });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const confimverify = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};
const loadlogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_Verified == 0) {
          res.status(400).json({ message: "Your account is suspended" });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/home");
        }
      } else {
        res
          .status(400)
          .json({ message: "Your email or password is incorrect" });
      }
    } else {
      res.status(400).json({ message: "Your email or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loadHome = async (req, res) => {
  try {
    const id = req.session.user_id;
    console.log(id);

    const userData = await User.findById(id);
    console.log(userData);
    const categorydata = await Category.find({ active: 0 })
      .sort({
        createdAt: -1,
      })
      .populate("offer");

    const prodactdata = await Product.find({ active: 0 })
      .sort({
        createdAt: -1,
      })
      .populate("offer");

    res.render("home", {
      product: prodactdata,
      category: categorydata,
      user: userData,
    });
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
    if (userData) {
      const randomString = randomstring.generate();
      const addtoken = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      sendResetVerifyMail(userData.fullname, userData.email, randomString);
      res.render("forgetpassword", { message: "please check your mail" });
    } else {
      res.render("forgetpassword", { message: "user mail is incorect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadreset = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("resetpassword", { user_id: tokenData._id });
    } else {
      res.render(404);
    }
  } catch (error) {
    console.log(error.message);
  }
};
const resetpassword = async (req, res) => {
  console.log(req.body.user_id);
  const password = req.body.password;
  const user_id = req.body.user_id;

  const spassword = await securePassword(password);

  const updateData = await User.updateOne(
    { _id: user_id },
    { $set: { password: spassword, token: "" } }
  );

  res.redirect("/login");
};
const logout = async (req, res) => {
  try {
    req.session.user_id = null;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const getallproducts = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await User.findById(id);
    const categorytData = await Category.find({}).populate("offer");
    let sortObject = {};

    let sort = req.query.sort ? req.query.sort : "";
    if (sort == "lh") {
      sortObject.price = 1;
    } else if (sort == "hl") {
      sortObject.price = -1;
      console.log(sort);
    } else if (sort == "latest") {
      sortObject.createdAt = -1;
    }

    // Search parameters
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // MongoDB queries
    const nameRegex = {
      productname: { $regex: ".*" + search + ".*", $options: "i" },
    };
    const shapeRegex = {
      frameshape: { $regex: ".*" + search + ".*", $options: "i" },
    };

    const query = {
      $or: [nameRegex, shapeRegex],
    };

    // Apply category filter
    if (req.query.categories) {
      const categoriesArray = req.query.categories.split(",");
      const trimmedCategories = categoriesArray.map((category) =>
        category.trim()
      );
      const categoriesFilter = { frameshape: { $in: trimmedCategories } };
      Object.assign(query, categoriesFilter);
    }
    console.log(req.query.categories);
    // Apply price filter
    if (req.query.prices) {
      const value = req.query.prices.split(",");

      const minPrice = parseInt(value[0]);
      const maxPrice = parseInt(value[1]);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        const priceFilter = {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        };
        Object.assign(query, priceFilter);
      } else {
        // Handle invalid price values (e.g., log an error or provide default values)
        console.error("Invalid price values:", req.query.prices);
      }
    }

    // Fetch products based on search and pagination
    const productData = await Product.find(query)
      .limit(limit)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .populate("offer")
      .exec();
    console.log(productData);
    // Count total products for pagination
    const count = await Product.countDocuments(query);

    // Render the page with filtered products
    res.render("allproducts", {
      product: productData,
      user: userData,
      categorytData,
      page,
      currentPage: page,
      previospage: page - 1,
      nextpage: parseInt(page) + 1,
      count: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getoneproduct = async (req, res) => {
  try {
    const id = req.query.id;
    const user_id = req.session.user_id;

    const userData = await User.findById(user_id);

    const productData = await Product.findById(id).populate('offer')

    const categoryData = await Product.find({
      frameshape: productData.frameshape,
    });
    console.log(categoryData);

    res.render("product", {
      product: productData,
      user: userData,
      categoryData: categoryData,
    });
  } catch (error) {
    console.log(error.message);
  }
};const loadcart = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await User.findById(id);

    const cartData = await Cart.findOne({ user: id }).populate("products.product");
    let totalAmount = 0;
    if (cartData) {
      for (const cartItem of cartData.products) {
        if (cartItem.product) { // Check if cartItem.product is not null
          const productPrice =
            cartItem.product.discountprice == null
              ? cartItem.product.price
              : cartItem.product.discountprice;
          const productCount = cartItem.count;
          totalAmount += productPrice * productCount;
        }
      }
    }
console.log(cartData);
    res.render("cart", {
      user: userData,
      cartData: cartData,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const profile = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await User.findById(id);

    res.render("profile", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const editprofile = async (req, res) => {
  try {
    console.log("hello");
    const user_id = req.session.user_id;

    const updateData = await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      }
    );
    res.json({success:true});
  } catch (error) {
    console.log(error.message);
  }
};
const changeemail = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const email = req.body.email;

    // Check if the email already exists
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      // Email already exists
      res.json({ exists: true });
    } else {
      const generatedOTP = generateAndStoreOTP(req);
      console.log(generatedOTP);
      req.session.email = email;

      sendVerifyMail(email, user_id.firstname, generatedOTP);

      return res.json({ mailsent: true });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const verify_email_change = async (req, res) => {
  try {
    const email = req.session.email;

    res.render("verifyemailchange", { email: email });
  } catch (error) {
    console.log(error.message);
  }
};

const check_verifyemail_change = async (req, res) => {
  try {
    const verifyotp = req.body.otp;
    const currTime = Math.floor(Date.now() / 1000);
    console.log(verifyotp);
    if (currTime <= req.session.otp.expiry) {
      if (req.session.otp.code === verifyotp) {
        const email = req.session.email;
        const user_id = req.session.user_id;

        console.log(email, "df");

        const updateEmail = await User.updateOne(
          { _id: user_id },
          { $set: { email: email } }
        );

        if (updateEmail.modifiedCount === 1) {
          res.json({ success: true });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Error creating user" });
        }
      } else {
        console.log("Invalid OTP");
        res.json({ invalid: true, message: "Invalid OTP" });
      }
    } else {
      res.json({ expired: true, message: "OTP has expired" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const changepassword = async (req, res) => {
  try {
    console.log(req.body);

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user_id = req.session.user_id;

    const userData = await User.findById(user_id);

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      userData.password
    );

    if (passwordMatch) {
      if (newPassword === confirmNewPassword) {
        const spassword = await securePassword(newPassword);

        await User.updateOne(
          { _id: user_id },
          { $set: { password: spassword } }
        );

        return res.json({
          updatePassword: true,
          message: "Password updated successfully.",
        });
      } else {
        return res
          .status(400)
          .json({
            notMatch: true,
            error: "New password and confirm password do not match.",
          });
      }
    } else {
      return res
        .status(400)
        .json({ oldNotMatch: true, error: "Current password does not match." });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to validate the new password on the server side
const validateNewPassword = (password) => {
  const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  loadregister,
  insestUser,
  sendVerifyMail,
  loadverifyotp,
  checkotp,
  confimverify,
  loadlogin,
  verifylogin,
  loadHome,
  getoneproduct,
  loadforget,
  verifyforget,
  resend,
  loadreset,
  resetpassword,
  logout,
  getallproducts,
  loadcart,
  profile,
  editprofile,
  changeemail,
  verify_email_change,
  check_verifyemail_change,
  changepassword,
};
