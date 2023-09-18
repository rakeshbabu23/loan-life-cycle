const mongoose = require("mongoose");
const Scheme = require("./scheme");
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
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
