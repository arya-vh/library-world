const express = require("express");
const { initializeEsewaPayment, completeEsewaPayment } = require("../controller/payFineController");

const payFineRouter = express.Router();

// Route to initialize eSewa payment
payFineRouter.post("/initialize-esewa", initializeEsewaPayment);

// Route to handle successful payments
payFineRouter.get("/payment-success", completeEsewaPayment);

// Route to handle failed payments (just redirects back)
payFineRouter.get("/payment-failure", (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

module.exports = payFineRouter;