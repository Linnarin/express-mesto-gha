const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;

const JWT_SECRET = 'strong_password';

const BadRequest = require('../utils/BadRequest');

const ConflictError = require('../utils/ConflictError');

const NotFound = require('../utils/NotFound');

const AuthError = require('../utils/AuthError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверный логин или пароль');
      } else {
        return bcrypt
          .compare(password, user.password)
          .then((isValidUser) => {
            if (isValidUser) {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET);
              res.cookie('jwt', token, {
                maxAge: 3600 * 24 * 7,
                httpOnly: true,
              });
              const {
                _id, name, about, avatar,
              } = user;
              res.send({
                _id, name, about, avatar, email,
              });
            } else {
              throw new AuthError('Неверный логин или пароль');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    User.create({
      ...req.body,
      password: hash,
    })
      .then((user) => {
        const {
          _id, name, about, avatar, email,
        } = user;
        res.status(201).send({
          _id, name, about, avatar, email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(
            new BadRequest(
              'Переданы некорректные данные при создании пользователя',
            ),
          );
        } else if (err.code === 11000) {
          next(
            new ConflictError('Пользователь с таким email уже существует'),
          );
        } else {
          next(err);
        }
      });
  });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.params.id ? req.params.id : req.user._id;

  User.findById(userId)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные пользователя'),
        );
      } else {
        next(err);
      }
    });
};

const updateUserData = (Name, data, req, res, next) => {
  Name.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUserData(User, { name, about }, req, res, next);
};

const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserData(User, { avatar }, req, res, next);
};

module.exports = {
  createUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateUsersAvatar,
  login,
};
