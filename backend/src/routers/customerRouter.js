const express = require("express");
const app = express();
const router = new express.Router();
const Customer = require("../db/models/customer");
const Account = require("../db/models/account");
const { Loan } = require("../db/models/loans");
const Scheme = require("../db/models/scheme");
const Transaction = require("../db/models/transactions");

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
router.put("/customers/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updateFields = req.body; 
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateFields,
      { new: true }
    );
    if (updatedCustomer) {
      res.status(200).json({
        message: "Customer updated",
        customer: updatedCustomer,
      });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error in updating customer", message: e.message });
  }
});

router.delete("/customers/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const deletedCustomer = await Customer.findByIdAndRemove(customerId);
    if (deletedCustomer) {
      res.status(200).json({
        message: "Customer deleted",
        customer: deletedCustomer,
      });
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error in deleting customer", message: e.message });
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
        accountNumber,
        ifsc,
      });
    } else {
      res.status(500).json({ message: "Failed to store account details" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error in creating an account", error: e.message });
  }
});

router.put("/customers/account", async (req, res) => {
  try {
    const { name, accountNumber, ifsc } = req.body;
    const getCustomer = await Customer.findOne({ name: name });
    if (!getCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const existingAccount = await Account.findOne({
      customer: getCustomer._id,
    });
    if (!existingAccount) {
      return res.status(404).json({ message: "Customer's account not found" });
    }
    existingAccount.accountNumber = accountNumber;
    existingAccount.ifsc = ifsc;
    const updatedAccount = await existingAccount.save();
    if (updatedAccount) {
      res.status(200).json({
        message: "Account details updated",
        accountNumber: updatedAccount.accountNumber,
        ifsc: updatedAccount.ifsc,
      });
    } else {
      res.status(500).json({ message: "Failed to update account details" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error in updating account details", error: e.message });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/customer/transaction", async (req, res) => {
  try {
    const customer = await Customer.findOne({ name: req.body.name });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerLoan = await Loan.findOne({ customer: customer._id });
    const customerAccount = await Account.findOne({ customer: customer._id });
    if (!customerLoan || !customerAccount) {
      return res
        .status(404)
        .json({ message: "Customer loan or account not found" });
    }
    const loanAmount = getRandomNumberFromArray(amount);
    const newTransaction = new Transaction({
      loan: customerLoan,
      customerName: customer.name,
      accountDetails: {
        accountNumber: customerAccount.accountNumber,
        ifsc: customerAccount.ifsc,
      },
    });
    await newTransaction.save();
    res.status(200).json({
      message: `${loanAmount} is credited into ${newTransaction.customerName}'s account number ${newTransaction.accountDetails.accountNumber}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
