const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },

  frameshape: {
    type: String,
    required: true,
  },
  category: {
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
    type: [String],
    required: true,
  },
  is_active: {
    type: Number,
    default: 0,
  }
});


module.exports = mongoose.model("products", productsSchema);
