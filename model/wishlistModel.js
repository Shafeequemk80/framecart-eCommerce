const mongoose = require("mongoose");
const user = require("./userModel");
const product = require("./productsModel");
const wishlistSchema = new mongoose.Schema({
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
      createdAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("wishlist", wishlistSchema);
