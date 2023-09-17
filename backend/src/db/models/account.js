const mongoose = require("mongoose");
const Customer = require("./customer");

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
