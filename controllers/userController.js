'use strict';

const { User, Position, sequelize } = require('../models/index');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const tinify = require('tinify');
const ImageKit = require('imagekit');
const envVars = require('../envVariables');
const { ErrorResponse } = require('../utils/errorHandling');

tinify.key = envVars.tinyPng.apiKey;

const imagekit = new ImageKit({
  publicKey: envVars.imageKit.publicApiKey,
  privateKey: envVars.imageKit.privateApiKey,
  urlEndpoint: envVars.imageKit.urlEndpoint
});

const users_get = async (req, res, next) => {
  try {
    let { page, offset, count = 5 } = req.query;
    count = Number(count);
    if (!Number.isInteger(count)) throw new ErrorResponse(422, 'Validation failed', 'Wrong count format')
    if (count < 1 || count > 100) throw new ErrorResponse(422, 'Validation failed', 'Wrong count value')
    if (typeof offset === 'undefined') {
      if (typeof page === 'undefined') {
        offset = 0, page = 1;
      } else {
        page = Number(page);
        if (!Number.isInteger(page)) throw new ErrorResponse(422, 'Validation failed', 'Wrong page format')
        if (page < 1) throw new ErrorResponse(422, 'Validation failed', 'Wrong page value')
      }
      offset = (page - 1) * count;
    } else {
      offset = Number(offset);
      if (!Number.isInteger(offset)) throw new ErrorResponse(422, 'Validation failed', 'Wrong offset format')
      if (offset < 0) throw new ErrorResponse(422, 'Validation failed', 'Wrong offset value')
      page = Math.ceil(offset / count) + 1;
    }

    const total_users = await User.count();
    if (total_users <= offset) throw new ErrorResponse(422, 'No users found for the chosen offset or page and count')
    const total_pages = Math.ceil(total_users / count);
    const next_url = page < total_pages ? req.baseUrl + `?page=${page + 1}&count=${count}` : null;
    const prev_url = page > 1 ? req.baseUrl + `?page=${page - 1}&count=${count}` : null;

    const users = await User.findAll({ 
      attributes: { 
        include: [ [ sequelize.literal(`(SELECT "position"."name" FROM "Positions" AS "position" WHERE "User"."position_id" = "position"."id")`), 'position' ] ],
        exclude: [ 'token_id' ]
      },
      // include: { association: 'position', attributes: [ 'name' ] }, // Could have just done this, but then the position name would be shown as a property of a nested object stored on the position property of the returned user record
      offset,
      limit: count,
      order: [['id', 'ASC']]
    });
    if (!users) throw new ErrorResponse(422, 'Users not found')

    res.json({ success: true, page, total_pages, total_users, count, links: { next_url, prev_url }, users });
  } catch (err) {
    next(err);
  }
};

const users_post = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) throw new ErrorResponse(401, 'No token provided')
    const decodedToken = jwt.verify(token, envVars.jwt.secret);
    const existingUser = await User.findOne({ where: { token_id: decodedToken.id } });
    if (existingUser) throw new ErrorResponse(401, 'Invalid token')
    req.body.token_id = decodedToken.id;

    const referredPosition = await Position.findByPk(req.body.position_id);
    if (!referredPosition) throw new ErrorResponse(422, 'Validation failed', 'Referred position missing')
    
    const photo = req.file;
    if (!photo) throw new ErrorResponse(422, 'Validation failed', 'User photo missing')
    const photoParams = await sharp(photo.buffer).metadata();
    if (photoParams.width < 70 || photoParams.height < 70) throw new ErrorResponse(422, 'Validation failed', 'Image too small')
    
    req.body.photo = 'placeholderURL';
    const newUser = await User.create(req.body);
    
    photo.buffer = await sharp(photo.buffer).resize(70, 70).toBuffer();
    photo.buffer = await tinify.fromBuffer(photo.buffer).toBuffer();
    const imageKitResponse = await imagekit.upload({
      file: photo.buffer.toString('base64'),
      fileName: photo.originalname.split('.')[0].concat('.jpg'),
      folder: '/abz-test-task/photos'
    });

    newUser.photo = imageKitResponse.url;
    await newUser.save();

    res.json({ success: true, user_id: newUser.id, message: "New user successfully registered" });
  } catch (err) {
    next(err);
  }
};

const user_get = async (req, res, next) => {
  try {
    if (!Number.isInteger(Number(req.params.user_id))) throw new ErrorResponse(422, 'Validation failed', 'Wrong userId format')

    const user = await User.findByPk(req.params.user_id, { 
      attributes: { 
        include: [ [ sequelize.literal(`(SELECT "position"."name" FROM "Positions" AS "position" WHERE "User"."position_id" = "position"."id")`), 'position' ] ],
        exclude: [ 'token_id', 'createdAt', 'updatedAt' ]
      }
    });
    if (!user) throw new ErrorResponse(404, 'The user with the requested identifier does not exist', 'User not found')

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  users_get,
  users_post,
  user_get
};