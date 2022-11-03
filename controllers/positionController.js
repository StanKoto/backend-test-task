const { Position }= require('../models/index');

exports.positions_get = async (req, res, next) => {
  try {
    if (Object.keys(req.query).length !== 0) throw new Error('Positions not found')
    const positions = await Position.findAll({ attributes: { exclude: [ 'createdAt', 'updatedAt' ] } });

    res.json({ success: true, positions });
  } catch (err) {
    next(err);
  }
};