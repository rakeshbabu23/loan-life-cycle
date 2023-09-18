const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  schemeName: {
    type: "String",
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
});

const Scheme = mongoose.model("Scheme", scheme);

module.exports = Scheme;
