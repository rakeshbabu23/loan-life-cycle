const mongoose = require("mongoose");
const { Loan } = require("./loans");
const Account = require("./account");
const Customer = require("./customer");
const { Jewel } = require("./loans");

const transactionSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  accountDetails: {
    accountNumber: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
