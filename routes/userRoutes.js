const express = require('express');
const multer = require('multer');
const envVars = require('../envVariables');
const { users_get, users_post, user_get } = require('../controllers/userController');

const upload = multer({
  limits: {
    fileSize: envVars.multer.fileSize
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) return cb(new Error('Image is invalid.'))
    cb(undefined, true);
  }
});

const userRouter = express.Router();

userRouter.route('/')
  .get(users_get)
  .post(upload.single('photo'), users_post);

userRouter.get('/:id', user_get);

module.exports = userRouter;