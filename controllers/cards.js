const Card = require('../models/card');

const ERROR_INACCURATE_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

const createCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INACCURATE_DATA).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: 'Произошла ошибка',
        });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({
        message: 'Произошла ошибка',
      });
    });
};

const deleteCard = (req, res) => {
  const { cardid } = req.params;
  Card.findByIdAndRemove(cardid)
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные при удалении карточки',
          });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not Found'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные для добавления лайка',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'id карточки не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not Found'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные для добавления лайка',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'id карточки не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
