const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  ireffered: [
    {
      clientname: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
  walletHistory: [
    {
      transactionId: {
        type: String,
      },
      transactionDate: {
        type: Date,
      },
      transactionDetails: {
        type: String,
      },
      transactionType: {
        type: String,
      },
      transactionAmount: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("wallet", walletSchema);
