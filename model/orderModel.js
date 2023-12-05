const mongoose = require("mongoose");
const user = require("./userModel");
const product = require("./productsModel");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      count: {
        type: Number,
        default: 1, // Set a default count if needed
      },
      totalprice: {
        type: Number,
        default: 0,
      },
      paymentStatus: {
        type: String,
        required: true,
      },
      orderStatus: {
        type: String,
        required: true,
      },
      statusLevel: {
        type: Number,
        default:1,
      },
    },
  ],
  address: [
    {
      fullname: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: false,
      },
      locality: {
        type: String,
        required: true,
      },
      zipcode: {
        type: Number,
        default: 0,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  orderTime: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  
  amount: {
    type: Number,
    default:1,
  },
});

module.exports = mongoose.model("order", orderSchema);
