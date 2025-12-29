const express = require('express');
const aiChatbot = express.Router();

// Import the controller function
const { getAiChatbotResponse } = require('../controller/aiChatbotController.js');

// Change this to POST to match your frontend request
aiChatbot.route('/').post(getAiChatbotResponse);

module.exports = getAiChatbotResponse;