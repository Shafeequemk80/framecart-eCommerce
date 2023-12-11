const mongoose = require('mongoose');

const offersSchema = new mongoose.Schema({
  offername: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date, // Fixed typo in the property name
    required: true
  },
  percentage: {
    type: Number, // Assuming it's a percentage, you can adjust the type accordingly
    required: true
  },
  action:{
    type:Number, 
    default:1
  }
});

module.exports = mongoose.model('Offer', offersSchema);
