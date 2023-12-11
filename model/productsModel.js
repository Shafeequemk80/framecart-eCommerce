const mongoose = require("mongoose");

const category = require("./categoryModel");
const productsSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },

  frameshape: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: {
    image1: {
      type: String,
      require: true,
    },
    image2: {
      type: String,
      require: true,
    },
    image3: {
      type: String,
      require: true,
    },
    image4: {
      type: String,
      require: true,
    },
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  discountprice: {
    type: Number,
    default: null,
  },
  active: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("products", productsSchema);
