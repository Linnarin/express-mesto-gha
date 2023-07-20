const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'test-secret' } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => new Error('NotData'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign(
              { _id: user._id },
              JWT_SECRET,
              { expiresIn: '7d' },
            );
            res.status(200).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send(user);
          } else {
            next(new Error('NotData'));
          }
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getAuthUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getAuthUser,
  getUser,
  updateUser,
  updateAvatar,
  login,
};
