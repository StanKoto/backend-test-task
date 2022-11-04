class ErrorResponse extends Error {
  constructor(statusCode, message, failReason) {
    super(message);
    this.statusCode = statusCode;
    if (typeof failReason !== 'undefined') this.failReason = failReason;
  }
}

const handleErrors = (err, req, res, next) => {
  const fails = {};

  if (err.parent && err.parent.code === '23505') {
    return res.status(409).json({ success: false, message: 'User with this phone or email already exists.' });
  }

  if (err.name && err.name === 'SequelizeValidationError') {
    for (const validationErrorItem of err.errors) {
      fails[validationErrorItem.path] = validationErrorItem.message;
    }
    return res.status(422).json({ success: false, message: 'Validation failed', fails });
  }

  if (err.message === 'jwt expired') return res.status(401).json({ success: false, message: 'The token expired' })

  if (err.message === 'File too large') {
    fails.photo = 'The photo may not be greater than 5 Mbytes.';
    return res.status(422).json({ success: false, message: 'Validation failed', fails });
  }

  if (err instanceof ErrorResponse) {
    if (err.failReason) {
      switch (err.failReason) {
        case 'Referred position missing':
          fails.position_id = 'The referred position must be present in the current position list!';
          break;
        case 'Image is invalid':
          fails.photo = err.message;
          break;
        case 'User photo missing':
          fails.photo = 'A user photo is required.';
          break;
        case 'Image too small':
          fails.photo = 'A user photo must be at least 70 pixels high and 70 pixels wide.';
          break;
        case 'Wrong count format':
          fails.count = 'The count must be an integer.';
          break;
        case 'Wrong count value':
          fails.count = 'The count must be at least 1 and not greater than 100.';
          break;
        case 'Wrong page format':
          fails.page = 'The page must be an integer.';
          break;
        case 'Wrong page value':
          fails.page = 'The page must be at least 1.';
          break;
        case 'Wrong offset format':
          fails.offset = 'The offset must be an integer.';
          break;
        case 'Wrong offset value':
          fails.offset = 'The offset cannot be less than 0.';
          break;
        case 'Wrong userId format':
          fails.user_id = 'The user_id must be an integer.'
          break;
        case 'User not found':
          fails.user_id = err.failReason;
          break;
      }
      return res.status(err.statusCode).json({ success: false, message: err.message, fails });
    }
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: 'Server error' });
};

module.exports = {
  ErrorResponse,
  handleErrors
};