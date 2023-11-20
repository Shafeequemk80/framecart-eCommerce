const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
}, address:[{
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


    module.exports=mongoose.model("address",addressSchema)