const Wallet = require("../model/walletModel");
require("dotenv").config();
const User = require("../model/userModel");
const Razorpay = require("razorpay");
const Crypto = require("crypto");

const moment = require("moment");
function hmac_sha256(data, secret) {
  const hmac = Crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
var instance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

function generateOrderId() {
  // Generate a random identifier (14 characters)
  const randomId = Math.random().toString(36).substring(2, 16).toUpperCase();

  return randomId;
}
const loadwallet = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    const userData = await User.findById(user_id);
    const walletData = await Wallet.findOne({ user: user_id });

    // You may want to check if userData and walletData are found before proceeding

    res.render("wallet", { user: userData, walletData, moment,pageName:"Wallet" });
  } catch (error) {
    res.render("500");
  }
};

const addtowallet = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const userData = await User.findById(user_id);
    const walletamount = req.body.walletamount;
    const newWalletId = generateOrderId();

    if (walletamount <= 5000) {
      const amount = walletamount * 100;
      const options = {
        amount: amount,
        currency: "INR",
        receipt: newWalletId,
      };

      instance.orders.create(options, (err, order) => {
        if (!err) {
          res.status(200).json({
            online: true,
            order_id: order.id,
            amount: amount,
            key_id: RAZORPAY_ID_KEY,
            receipt: options.receipt,
            contact: userData.mobile,
            name: userData.firstname,
            email: userData.email,
          });
        } else {
          res
            .status(400)
            .send({ success: false, msg: "Something went wrong!" });
        }
      });
    } else {
      res.json({
        noteligible: true,
        amount: walletamount,
      });
    }
  } catch (error) {
    res.render("500");
  }
};

const verifyonlinepayment = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const razorpay_signature = req.body.response.razorpay_signature;
    const order_id = req.body.response.razorpay_order_id;
    const razorpay_payment_id = req.body.response.razorpay_payment_id;
    const secret = RAZORPAY_SECRET_KEY;
    const walletamount = req.body.data.amount / 100;

    generated_signature = hmac_sha256(
      order_id + "|" + razorpay_payment_id,
      secret
    );

    if (generated_signature == razorpay_signature) {
      try {
        const userData = await User.findById(user_id);
        const walletData = await Wallet.findOne({ user: user_id });

        const transactionDetails = {
          transactionId: razorpay_payment_id,
          transactionDate: new Date(),
          transactionDetails: "Credit",
          transactionType: "OnlinePayment",
          transactionAmount: walletamount,
        };

        if (walletData) {
          // Update existing wallet entry
          walletData.totalAmount += walletamount;
          walletData.walletHistory.push(transactionDetails);
          await walletData.save();
        } else {
          // Create new wallet entry
          const newWalletEntry = new Wallet({
            user: user_id,
            totalAmount: walletamount,
            walletHistory: [transactionDetails],
          });

          await newWalletEntry.save();
        }

        // Continue with other processing or response handling
      } catch (error) {
        res.render("500");
      }

      return res.json({ online: true });
    } else {
    }
  } catch (error) {
    res.render("500");
  }
};

module.exports = {
  loadwallet,
  addtowallet,
  verifyonlinepayment,
};
