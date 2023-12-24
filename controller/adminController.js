const bctypt = require("bcryptjs");
const User = require("../model/userModel");
const Order = require("../model/orderModel");
const Category = require("../model/categoryModel");
const Products = require("../model/productsModel");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");
const { token } = require("morgan");
const Offer = require("../model/offerModel");
const moment = require('moment');
const securePassword = async (password) => {
  try {
    const passwordHash = bctypt.hash(password, 10);
    return passwordHash;
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
const loadLogin = async (req, res) => {
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
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bctypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_Admin == 0) {
          res.render("login", { message: "No account found" });
        } else {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/dashboard");
        }
      } else {
        res.render("login", {
          message: "your E-mail or password is incorrect",
        });
      }
    } else {
      res.render("login", { message: "your E-mail or password is incorrect" });
    }
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
    console.log(userData);
    if (userData) {
      const randomString = randomstring.generate();

      const tokenData = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );

      sendResetVerifyMail("admin", userData.email, randomString);
      res.render("forgetpassword", { message: "please check your mail" });
    } else {
      res.render("forgetpassword", { message: "not found account" });
    }
  } catch (error) {}
};

const loadreset = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("resetpassword", { user_id: tokenData._id });
    } else {
      res.render("404");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyreset = async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    const spassword = await securePassword(password);
    const updateData = await User.updateOne(
      { _id: user_id },
      { $set: { password: spassword, token: "" } }
    );
    if (updateData) {
      res.redirect("/");
    } else {
      res.render("resetpassword", { message: "passwrod reset not success" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const customerload = async (req, res) => {
  try {
    var search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    console.log(search, "search value ");
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    var limit = 5;

    const userData = await User.find({
      $or: [
        { firstname: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    })

      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.find({
      $or: [
        { firstname: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    }).countDocuments();

    const currentPage = page * 1;

    res.render("customers", {
      users: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previospage: page - 1,
      nextpage: parseInt(page) + 1,
      count: count,
      search: search,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.admin_id = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const loadproducts = async (req, res) => {
  try {
  var search = "";

  if (req.query.search) {
    search = req.query.search;
  }

  console.log(search, "search value ");
  var page = 1;
  if (req.query.page) {
    page = req.query.page;
  }

  var limit = 5;

  const productData = await Products.find({
    $or: [
      { productname: { $regex: ".*" + search + ".*", $options: "i" } },
      { frameshape: { $regex: ".*" + search + ".*", $options: "i" } },
    ],
  })

    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("offer")
    .exec();

  const count = await Products.find({
    $or: [
      { productname: { $regex: ".*" + search + ".*", $options: "i" } },
      {frameshape: { $regex: ".*" + search + ".*", $options: "i" } },
    ],
  }).countDocuments();

  const offerData = await Offer.find({ action: 1 });
  res.render("products", {
    products: productData,
    offerData:offerData,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previospage: page - 1,
    nextpage: parseInt(page) + 1,
    count: count,
    search: search,
  });

  
  } catch (error) {
    console.log(error.message);
  }
};

const loadorders = async (req, res) => {
  try {
    var search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    console.log(search, "search value ");
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    let limit = 5;

    const  order = await Order.find({
      $and: [
        { "products.paymentStatus": { $ne: "pending" } },
        {
          $or: [
            { paymentMethod: { $regex: new RegExp(search, "i") } },
            { orderId: { $regex: new RegExp(search, "i") } },
            { "user.firstname": { $regex: new RegExp(search, "i") } },
          ],
        },
      ],
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user")
      .sort({ orderDate: -1 })
      .exec();

    const count = await Order.find({
      $or: [{ paymentMethod: { $regex: ".*" + search + ".*", $options: "i" } },
      { orderId: { $regex: ".*" + search + ".*", $options: "i" } },
      { "user.firstname": { $regex: new RegExp(search, "i") } },],
    }).countDocuments();

    const currentPage = page * 1;

    res.render("orders", {
      order: order,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previospage: page - 1,
      nextpage: parseInt(page) + 1,
      count: count,
      search: search,
    });
  } catch (error) {
    console.log(error.message);
  }
};
const allorderitems = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    const userOrders = await Order.find({ orderId: orderId })
      .populate("products.product")
      .sort({ _id: -1 });

    // Extracting product details from the orders
    const products = userOrders.reduce((allProducts, order) => {
      const orderProducts = order.products.map((product) => ({
        order: order,
        productDetails: product.product, // Fix the reference to product.productDetails
        count: product.count,
        totalprice: product.totalprice,
        paymentStatus: product.paymentStatus,
        orderStatus: product.orderStatus,
      }));
      return [...allProducts, ...orderProducts];
    }, []);

    console.log(products.map(product => product.productDetails)); // Log product details

    res.render("allorderitems", { orders: products ,moment});
  } catch (error) {
    console.log(error);
    // Handle the error appropriately (e.g., send an error response)
    res.status(500).send("Internal Server Error");
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const orderStatus = req.body.newStatus;
    const orderId = req.body.orderId;
    const id = req.body.id;

    let statusLevel = 0;

    switch (orderStatus) {
      case "Shipped":
        statusLevel = 2;
        break;
      case "Out of Delivery":
        statusLevel = 3;
        break;
      case "Delivered":
        statusLevel = 4;
        break;
      case "Cancelled":
        statusLevel = 5;
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid orderStatus" });
    }

    const order = await Order.findOne({
      orderId: orderId,
      "products.product": id,
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const productIndex = order.products.findIndex((product) => product.product.equals(id));

    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: "Product not found in the order" });
    }


    let updateFields = {
      "products.$.orderStatus": orderStatus,
      "products.$.statusLevel": statusLevel,
    };

    if (orderStatus === "Delivered") {
      updateFields = {
        "products.$.orderStatus": orderStatus,
        "products.$.statusLevel": statusLevel,
        "products.$.paymentStatus":"success"
      };
    
    }

    const updatedOrderStatus = await Order.updateOne(
      {
        orderId: orderId,
        "products.product": id,
      },
      {
        $set: updateFields,
      }
    );

    if (updatedOrderStatus.modifiedCount === 1) {
      return res.status(200).json({ success: true, message: orderStatus });
    } else {
      return res.status(400).json({ success: false, error: "Failed to update order status" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  loadLogin,
  verifylogin,
  loadforget,
  verifyforget,
  loadreset,
  verifyreset,
  customerload,
  logout,
  loadproducts,
  loadorders,
  allorderitems,
  updateOrderStatus,
};
