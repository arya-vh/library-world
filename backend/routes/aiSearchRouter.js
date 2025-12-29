const express = require('express');
const aiSearchRouter = express.Router();

// Import the controller function
const { getAiSearchData } = require('../controller/AISearchController');

// Change this to POST to match your frontend request
aiSearchRouter.route('/').post(getAiSearchData);

module.exports = aiSearchRouter;