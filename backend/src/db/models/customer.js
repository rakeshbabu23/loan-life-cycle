const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: "String",
    
  },
  contactInfo: {
    type: "String",
   
  },
  aadharFront: {
    type: "String",
    
  },
  aadharBack: {
    type: "String",
   
  },
  pan: {
    type: "String",
    
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
