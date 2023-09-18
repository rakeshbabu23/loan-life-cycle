const mongoose = require("mongoose");
const Scheme = require("./scheme");
const Customer = require("./customer");

const jewelSchema = new mongoose.Schema({
  jewelName: {
    type: String,
    required: true,
  },
  jewelWeight: {
    type: Number,
    required: true,
  },
});

const loanSchema = new mongoose.Schema({
  jewels: [jewelSchema],
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const Jewel = mongoose.model("Jewel", jewelSchema);
const Loan = mongoose.model("Loan", loanSchema);
module.exports = { Jewel, Loan };
