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
  address:[{
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
    }] 
  })


    module.exports=mongoose.model("category",categorySchema)