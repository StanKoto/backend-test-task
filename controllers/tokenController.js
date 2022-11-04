const jwt = require('jsonwebtoken');
const envVars = require('../envVariables');

exports.token_get = async (req, res, next) => {
  try {
    const { nanoid } = await import('nanoid');
    
    const token = jwt.sign({ id: nanoid() }, envVars.jwt.secret, {
      expiresIn: envVars.jwt.expiresIn
    });

    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};