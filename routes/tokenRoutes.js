'use strict';

const express = require('express');
const { token_get } = require('../controllers/tokenController');

const tokenRouter = express.Router();

tokenRouter.get('/', token_get);

module.exports = tokenRouter;