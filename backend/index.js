const express = require("express");
const app = express();
require("./src/db/mongoose");
const customerRouter = require("./src/routers/customerRouter");
app.use(express.json());
app.use(customerRouter);
app.listen(3000, () => {
  console.log("server is running");
});
