const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  aadharFront: {
    type: "String",
    required: true,
  },
  aadharBack: {
    type: "String",
    required: true,
  },
  pan: {
    type: "String",
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
