const axios = require("axios");
const crypto = require("crypto");
const BookTransaction = require("../models/bookTransaction");

// Function to generate eSewa Payment Hash
async function getEsewaPaymentHash({ amount, transaction_uuid }) {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    const secretKey = process.env.ESEWA_SECRET_KEY;

    const hash = crypto.createHmac("sha256", secretKey).update(data).digest("base64");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
}

// Function to verify eSewa payment
async function verifyEsewaPayment(encodedData) {
  try {
    let decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
    decodedData = JSON.parse(decodedData);

    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto.createHmac("sha256", secretKey).update(data).digest("base64");

    if (hash !== decodedData.signature) {
      throw { message: "Invalid signature", decodedData };
    }

    const response = await axios.get(`${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/`, {
      params: {
        product_code: process.env.ESEWA_PRODUCT_CODE,
        total_amount: decodedData.total_amount,
        transaction_uuid: decodedData.transaction_uuid,
      },
    });

    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Invalid transaction", decodedData };
    }

    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
}

// Route to initialize payment
exports.initializeEsewaPayment = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Find the transaction
    const bookTransaction = await BookTransaction.findOne({ userId, _id: bookId });

    if (!bookTransaction || bookTransaction.extraCharge <= 0) {
      return res.status(400).json({ success: false, message: "No fine to pay." });
    }

    // Create payment hash
    const transaction_uuid = `TXN${Date.now()}`;
    const paymentInitiate = await getEsewaPaymentHash({
      amount: bookTransaction.extraCharge,
      transaction_uuid,
    });

    // Redirect to eSewa
    const esewaUrl = `${process.env.ESEWA_PAYMENT_URL}?amt=${bookTransaction.extraCharge}&txAmt=0&psc=0&pdc=0&scd=${process.env.ESEWA_MERCHANT_CODE}&pid=${transaction_uuid}&su=${process.env.BACKEND_URL}/api/v1/payment-success?userId=${userId}&bookId=${bookId}&fu=${process.env.BACKEND_URL}/api/v1/payment-failure`;

    res.json({ success: true, esewaUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route to handle successful payment
exports.completeEsewaPayment = async (req, res) => {
  const { data } = req.query;

  try {
    const paymentInfo = await verifyEsewaPayment(data);

    // Find transaction
    const bookTransaction = await BookTransaction.findById(paymentInfo.response.transaction_uuid);
    if (!bookTransaction) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }

    // Clear the fine
    await BookTransaction.findByIdAndUpdate(bookTransaction._id, { extraCharge: 0 });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
};
