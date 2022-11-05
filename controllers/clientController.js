const path = require('path');

const homePage_get = (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../views/index.html'));
};

const users_get = (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../views/users.html'));
};

const registrationForm_get = (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../views/registrationForm.html'));
};

module.exports = {
  homePage_get,
  users_get,
  registrationForm_get
};