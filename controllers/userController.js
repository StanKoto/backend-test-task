'use strict';

const { User, sequelize } = require('../models/index');
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
    let { page, offset, count } = req.query;
    if (typeof count === 'undefined') {
      count = 5;
    } else {
      if (count.trim().length === 0) throw new ErrorResponse(422, 'Validation failed', 'Wrong count format')
      count = Number(count);
      if (!Number.isInteger(count)) throw new ErrorResponse(422, 'Validation failed', 'Wrong count format')
      if (count < 1 || count > 100) throw new ErrorResponse(422, 'Validation failed', 'Wrong count value')
    }
    if (typeof offset === 'undefined') {
      if (typeof page === 'undefined') {
        offset = 0, page = 1;
      } else {
        if (page.trim().length === 0) throw new ErrorResponse(422, 'Validation failed', 'Wrong page format')
        page = Number(page);
        if (!Number.isInteger(page)) throw new ErrorResponse(422, 'Validation failed', 'Wrong page format')
        if (page < 1) throw new ErrorResponse(422, 'Validation failed', 'Wrong page value')
      }
      offset = (page - 1) * count;
    } else {
      if (offset.trim().length === 0) throw new ErrorResponse(422, 'Validation failed', 'Wrong offset format')
      offset = Number(offset);
      if (!Number.isInteger(offset)) throw new ErrorResponse(422, 'Validation failed', 'Wrong offset format')
      if (offset < 0) throw new ErrorResponse(422, 'Validation failed', 'Wrong offset value')
      page = Math.ceil(offset / count) + 1;
    }

    const total_users = await User.count();
    if (total_users <= offset) throw new ErrorResponse(422, 'No users found for the chosen offset or page and count')
    const total_pages = Math.ceil(offset / count) + Math.ceil((total_users - offset) / count);
    const next_url = page < total_pages ? req.baseUrl + `?offset=${offset + count}&count=${count}` : null;
    const prevUrlSearch = page === 2 ? `?count=${count}`: page > 2 ? `?offset=${offset - count}&count=${count}` : null;
    const prev_url = page >= 2 ? req.baseUrl + prevUrlSearch : null;

    const users = await User.findAll({ 
      attributes: { 
        include: [ [ sequelize.literal(`(SELECT "position"."name" FROM "Positions" AS "position" WHERE "User"."position_id" = "position"."id")`), 'position' ] ],
        exclude: [ 'token_id' ]
      },
      // include: { association: 'position', attributes: [ 'name' ] }, // Could have just done this, but then the position name would be shown as a property of a nested object stored on the position property of the returned user record
      order: [['id', 'ASC']],
      offset,
      limit: count
    });
    if (!users) throw new ErrorResponse(422, 'Users not found')

    res.json({ success: true, page, total_pages, total_users, count, links: { next_url, prev_url }, users });
  } catch (err) {
    next(err);
  }
};

const users_post = async (req, res, next) => {
  try {
    let newUser;

    const token = req.headers.token;
    if (!token) throw new ErrorResponse(401, 'No token provided')
    const decodedToken = jwt.verify(token, envVars.jwt.secret);
    const existingUser = await User.findOne({ where: { token_id: decodedToken.id } });
    if (existingUser) throw new ErrorResponse(401, 'Invalid token')
    req.body.token_id = decodedToken.id;

    if (req.body.phone.length !== 0) req.body.phone = req.body.phone.replace(/\s+/g, '')
    
    const photo = req.file;
    if (photo) {
      const photoParams = await sharp(photo.buffer).metadata();
      if (photoParams.width < 70 || photoParams.height < 70) throw new ErrorResponse(422, 'Validation failed', 'Img too small')
      req.body.photo = 'Photo link placeholder';
      await sequelize.transaction(async t => {
        newUser = await User.create(req.body, { transaction: t });
        photo.buffer = await tinify.fromBuffer(photo.buffer).toBuffer();
        photo.buffer = await sharp(photo.buffer).resize(70, 70).toBuffer();
        const imageKitResponse = await imagekit.upload({
          file: photo.buffer.toString('base64'),
          fileName: photo.originalname.split('.')[0].concat('.jpg'),
          folder: '/abz-test-task/photos'
        });
        newUser.photo = imageKitResponse.url;
        await newUser.save({ transaction: t });
      });

      res.json({ success: true, user_id: newUser.id, message: "New user successfully registered" });
    } else {
      delete req.body.photo;
      await User.create(req.body);
    }
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