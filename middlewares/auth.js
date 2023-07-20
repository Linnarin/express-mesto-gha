const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'strong_password');
  } catch (err) {
    next(new AuthError('Неверный логин или пароль'));
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};

/*
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  if (!token) {
    next(new UnauthorizedError('Неверный логин или пароль'));
  }
  try {
    payload = jwt.verify(token, 'strong_password');
  } catch (err) {
    next(new UnauthorizedError('Неверный логин или пароль'));
  }

  req.user = payload;

  return next();
};
*/
module.exports = { auth };
