const mongoose = require("mongoose");
const { Loan } = require("./loans");
const Account = require("./account");
const Customer = require("./customer");
const { Jewel } = require("./loans");

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
