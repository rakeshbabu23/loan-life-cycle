const express = require("express");
const app = express();
const router = new express.Router();
const Customer = require("../db/models/customer");
const Account = require("../db/models/account");
const { Loan } = require("../db/models/loans");
const Scheme = require("../db/models/scheme");

const amount = [1000, 2000, 3000, 4000, 5000];
function getRandomNumberFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

router.post("/customers/kyc", async (req, res) => {
  try {
    const { name, aadharFront, aadharBack, pan } = req.body;
    if (!name || !aadharFront || !aadharBack || !pan) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const customer = new Customer(req.body);
    const result = await customer.save();
    if (result) {
      res.status(201).json({
        message: "Customer created",
        result,
      });
    } else {
      res.status(500).json({ error: "Failed to create customer" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error in creating customer", message: e.message });
  }
});

router.post("/customers/account", async (req, res) => {
  try {
    const { name, accountNumber, ifsc } = req.body;
    const getCustomer = await Customer.findOne({ name: name });

    if (!getCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const account = new Account({
      name: name,
      accountNumber: accountNumber,
      ifsc: ifsc,
      customer: getCustomer._id,
    });
    const customerAccount = await account.save();

    if (customerAccount) {
      res.status(200).json({
        message: "Account created",
        result: customerAccount,
      });
    } else {
      res.status(500).json({ message: "Failed to create an account" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error in creating an account", error: e.message });
  }
});

router.post("/customers/appraisal", async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ schemeName: "scheme-one" });
    const getCustomer = await Customer.findOne({ name: req.body.name });

    if (!scheme) {
      res.status(404).json({ message: "Schema not found" });
      return;
    }
    if (!getCustomer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    const newLoan = new Loan({
      jewels: req.body.jewels,
      scheme: scheme,
      customer: getCustomer,
    });
    await newLoan.save();
    res.status(201).json({ message: "Loan created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/customer/transaction", async (req, res) => {
  try {
    const customer = await Customer.findOne({ name: req.body.name });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const loans = await Loan.findOne({ customer: customer._id });
    const accounts = await Account.findOne({ customer: customer._id });
    const loanAmount = getRandomNumberFromArray(amount);
    res.status(200).json({
      message: `${loanAmount} is credited into ${customer.name}'s account number ${accounts.accountNumber} `,
      customer: {
        _id: customer._id,
        name: customer.name,
        aadharFront: customer.aadharFront,
        aadharBack: customer.aadharBack,
        pan: customer.pan,
      },
      loans,
      accounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
