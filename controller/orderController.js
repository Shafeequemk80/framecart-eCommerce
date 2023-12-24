const Category = require("../model/categoryModel");
const Products = require("../model/productsModel");
const user_route = require("../routes/userRoute");
const Order = require("../model/orderModel");
const { logout } = require("./userController");
const moment = require("moment");

const Wallet = require("../model/walletModel");


const allorders = async (req, res) => {
  try {
    const user_id = req.session.user_id;

    const userOrders = await Order.find({ user: user_id })
      .populate("products.product")
      .sort({ _id: -1 });

    console.log(userOrders);

    res.render("allorders", {
      user: user_id,
      products: userOrders,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
  }
};

const vieworder = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const orderId = req.query.id;


    const userOrders = await Order.findOne({ _id: orderId })
      .populate("products.product")
      .exec();

    console.log(userOrders);

    res.render("vieworder", {
      orders: userOrders,
      user: user_id,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    // Handle the error appropriately (e.g., send an error response)
    res.status(500).send("Internal Server Error");
  }
};
const cancelorder = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const { id, orderId, count } = req.body;

    const orderUpdate = await Order.findOneAndUpdate(
      { user: user_id, "products.product": id, orderId: orderId },
      {
        $set: {
          "products.$.orderStatus": "Cancelled",
          "products.$.statusLevel": 5,
        },
      },
      { new: true } // Ensure you get the updated document
    );

    // Calculate totalprice by summing up the prices of the canceled products


    let totalprice = 0;
    let status = '';
    
    orderUpdate.products.forEach((product) => {
      if (product.product == id) {
        totalprice = product.totalprice;
        status = product.paymentStatus;
      }
    });
    
    console.log(orderUpdate,totalprice,status);

    const updateStock = await Products.findByIdAndUpdate(id, {
      $inc: { stock: count },
    });

    // Assuming you have the correct reference to Wallet model
    if (status== "success") {
      const walletUpdate = await Wallet.updateOne(
        { user: user_id },
        {
          $inc: { totalAmount: totalprice },
          $push: {
            walletHistory: {
              transactionId: orderId,
              transactionDate: new Date(),
              transactionDetails: "Credit",
              transactionType: "Cancel Order",
              transactionAmount: totalprice,
            },
          },
        }
      );
    }

    if (orderUpdate && updateStock) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const returnorder = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const id = req.body.id;
    const orderId = req.body.orderId;
    const count = req.body.count;

    const orderUpdate = await Order.findOneAndUpdate(
      { user: user_id, "products.product": id, orderId: orderId },
      {
        $set: {
          "products.$.orderStatus": "Returned",
          "products.$.statusLevel": 6,
        },
      }
    );
    orderUpdate;

    const updatestock = await Products.findByIdAndUpdate(id, {
      $inc: { stock: count },
    });


    let totalprice = 0;
    let status = '';
    
    orderUpdate.products.forEach((product) => {
      if (product.product == id) {
        totalprice = product.totalprice;
        status = product.paymentStatus;
      }
    });

    if (status== "success") {
      const walletUpdate = await Wallet.updateOne(
        { user: user_id },
        {
          $inc: { totalAmount: totalprice },
          $push: {
            walletHistory: {
              transactionId: orderId,
              transactionDate: new Date(),
              transactionDetails: "Credit",
              transactionType: "Rerurn Order",
              transactionAmount: totalprice,
            },
          },
        }
      );
    }

    if (orderUpdate && updatestock) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const invoiceprint = async (req, res) => {
  try {
    const id = req.query.id;
    const user_id = req.session.user_id;
    const orderData = await Order.findOne({
      $and: [{ orderId: id }, { user: user_id }],
    }).populate("products.product");

    console.log(orderData);

    res.render("invoice-print", { orderData: orderData, moment: moment });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  allorders,
  cancelorder,
  vieworder,
  returnorder,
  invoiceprint,
};
