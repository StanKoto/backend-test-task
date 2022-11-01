const users_get = async (req, res, next) => {
  res.json({ message: 'This is a users list' });
};

const users_post = async (req, res, next) => {
  res.json({ message: 'Here you can register a new user' });
};

const user_get = async (req, res, next) => {
  res.json({ message: 'This is a user\'s page' });
};

module.exports = {
  users_get,
  users_post,
  user_get
};