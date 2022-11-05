const express = require('express');
const { homePage_get, users_get, registrationForm_get } = require('../controllers/clientController');

const clientRouter = express.Router();

clientRouter.get('/', homePage_get);
clientRouter.get('/users', users_get);
clientRouter.get('/registration-form', registrationForm_get);

module.exports = clientRouter;