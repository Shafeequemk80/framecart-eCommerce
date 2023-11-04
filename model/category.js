const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: false,
  },
  icon: {
    type: String,
    required: true,
  },
   active: {
    type: Number,
    default: 0,
  },
  })


    module.exports=mongoose.model("category",categorySchema)