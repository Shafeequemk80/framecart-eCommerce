const mongoose = require("mongoose");
const user = require("../model/userModel");
const product = require("../model/productsModel");
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        count: {
          type: Number,
          default: 1 // Set a default count if needed
        },
      }
    ],
  createdAt: {
    type: Number,
    required: true,
  },




  })


 module.exports=mongoose.model("cart",cartSchema)