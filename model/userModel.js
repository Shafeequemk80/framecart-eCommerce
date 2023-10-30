const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  is_Admin: {
    type: Number,
    default: 0,
  },
  is_Verified: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
    default: "",
  },
});


module.exports = mongoose.model("user", userSchema);
