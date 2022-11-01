const express = require('express');
const { users_get, users_post, user_get } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.route('/')
  .get(users_get)
  .post(users_post);

userRouter.get('/:id', user_get);

module.exports = userRouter;