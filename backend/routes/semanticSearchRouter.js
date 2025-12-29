const express = require('express');
const semanticSearchRouter = express.Router();

// Import the controller function
const { getSemanticSearchData } = require('../controller/semanticSearchController');

// Change this to POST to match your frontend request
semanticSearchRouter.post('/', getSemanticSearchData);

module.exports = semanticSearchRouter;