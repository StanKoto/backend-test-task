'use strict';

const express = require('express');
const { positions_get } = require('../controllers/positionController');

const positionRouter = express.Router();

positionRouter.get('/', positions_get);

module.exports = positionRouter;