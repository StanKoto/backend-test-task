'use strict';

const { Position }= require('../models/index');
const { ErrorResponse } = require('../utils/errorHandling');

exports.positions_get = async (req, res, next) => {
  try {
    const positions = await Position.findAll({ attributes: { exclude: [ 'createdAt', 'updatedAt' ] } });
    if (!positions) throw new ErrorResponse(422, 'Positions not found')

    res.json({ success: true, positions });
  } catch (err) {
    next(err);
  }
};