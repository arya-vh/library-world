const nodemailer = require('nodemailer');
const express = require('express');
const BookTransactionSchema = require('../models/bookTransaction');
const CheckBookReturnRouter = express.Router();

const runBookReturnCheck = async (req, res) => {
  await checkBookReturn();
  res.status(200).json({ success: true, message: `Book Fine Charges Checked & Emails Sent` });
};

CheckBookReturnRouter.route('/').get(runBookReturnCheck);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to check overdue books and update fines
const checkBookReturn = async () => {
  try {
    const overdueTransactions = await BookTransactionSchema.find({
      returnDate: { $lt: new Date() },
      isReturned: false,
    });

    overdueTransactions.forEach(async (transaction) => {
      const daysOverdue = Math.floor((new Date() - transaction.returnDate) / (1000 * 60 * 60 * 24));
      let newFine = 100 + (daysOverdue - 1) * 20;
      if (newFine > 1000) newFine = 1000; // Max fine cap

      if (transaction.extraCharge !== newFine) {
        transaction.extraCharge = newFine;
        await transaction.save();
        
        // Send fine notification email
        sendFineNotification(transaction.userEmail, transaction.bookTitle, daysOverdue, newFine);
      }
    });
  } catch (error) {
    console.error('Error updating book fine charges:', error);
  }
};

// Function to send fine notification email
const sendFineNotification = (userEmail, bookTitle, daysOverdue, fineAmount) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, 
    to: userEmail,
    subject: 'Overdue Book Fine Notification',
    text: `Dear User,\n\nYour book "${bookTitle}" is overdue by ${daysOverdue} days. A fine of ₹${fineAmount} has been applied.\n\nPlease return the book as soon as possible to avoid further fines.\n\nRegards,\nPustak Prabandha`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending fine notification email:', error);
    } else {
      console.log('Fine notification email sent:', info.response);
    }
  });
};

module.exports = CheckBookReturnRouter;