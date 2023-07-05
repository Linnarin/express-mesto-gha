const User = require('../models/user');

const ERROR_INACCURATE_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INACCURATE_DATA).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: 'Произошла ошибка',
        });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({
        message: 'Произошла ошибка',
      });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({
          message: 'Переданы некорректные данные пользователя',
        });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const updateUserData = (Name, data, req, res) => {
  Name.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserData(User, { avatar }, req, res);
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  updateUserData(User, { name, about }, req, res);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUsersAvatar,
};
