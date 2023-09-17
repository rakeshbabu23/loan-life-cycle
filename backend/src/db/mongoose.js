const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://baburakesh2301:rakesh@cluster1.60ohp4j.mongodb.net/loanlifecycle?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("error in connection");
  });
