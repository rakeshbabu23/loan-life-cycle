const express = require("express");
const app = express();
const router = new express.Router();
const Customer = require("../db/models/customer");
const Account = require("../db/models/account");

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

module.exports = router;
