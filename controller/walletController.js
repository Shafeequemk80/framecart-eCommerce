const Wallet = require("../model/walletModel");
const User = require("../model/userModel");
const Razorpay = require("razorpay");
const Crypto = require("crypto");

function hmac_sha256(data, secret) {
  const hmac = Crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

const instance = new Razorpay({
  key_id: "rzp_test_X95zcCjqK3bbAQ",
  key_secret: "WHrgT4zUIFZEkYq97HfNQTO6",
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
    const walletDataCredit = await Wallet.findOne({ user: user_id, "walletHistory.transactionDetails": "Credit" },{walletHistory: 1 });
    const walletDataDebit = await Wallet.findOne({ user: user_id,"walletHistory.transactionDetails":"Debit" });
    console.log(walletDataCredit);

    res.render("wallet", { user: userData, walletData: walletData,walletDataCredit:walletDataCredit,walletDataDebit });
  } catch (error) {
    console.log(error.message);
  }
};

const addtowallet = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const userData = await User.findById(user_id);
    const walletamount = req.body.walletamount;
    const newWalletId = generateOrderId();

    if (walletamount < 5000) {
      const amount = walletamount*100;
      const options = {
        amount: amount,
        currency: "INR",
        receipt: newWalletId,
      };

      instance.orders.create(options, (err, order) => {
        if (!err) {
          console.log("Order created successfully:", order);
          res.status(200).json({
            online: true,
            order_id: order.id,
            amount: amount,
            key_id: "rzp_test_X95zcCjqK3bbAQ",
            receipt: options.receipt,
            contact: userData.mobile,
            name: userData.firstname,
            email: userData.email,
          });
        } else {
          console.error("Error creating order:", err);
          res
            .status(400)
            .send({ success: false, msg: "Something went wrong!" });
        }
      });
    } else {
      res.json({ noteligible: true });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, msg: "Internal server error" });
  }
};

const verifyonlinepayment = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const razorpay_signature = req.body.response.razorpay_signature;
    const order_id = req.body.response.razorpay_order_id;
    const razorpay_payment_id = req.body.response.razorpay_payment_id;
    const secret = "WHrgT4zUIFZEkYq97HfNQTO6";
    const walletamount = req.body.data.amount/100;

    console.log(req.body);

    generated_signature = hmac_sha256(
      order_id + "|" + razorpay_payment_id,
      secret
    );
    console.log(generated_signature);
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
            console.log(newWalletEntry);
          }
          
          // Continue with other processing or response handling
      
        } catch (error) {
          console.error(`Error processing Razorpay payment: ${error.message}`);
          // Handle the error appropriately, such as sending an error response
        }
         
      console.log("payment is successful");
      return res.json({ online: true });
    
      }
      else {
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.log(error.message, "dfadsfds");
  }
};

module.exports = {
  loadwallet,
  addtowallet,
  verifyonlinepayment,
};
