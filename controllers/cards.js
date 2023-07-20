const Card = require('../models/card');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!name || !link) {
    res.status(400).send({ message: 'Обязательные поля не заполнены' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => Error('NotValidId'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        res.status(403).send({ message: 'У вас нет прав на удалениие данной карточки' });
      } else {
        // если да, то удаляем карточку
        Card.findByIdAndRemove(id)
          .then(() => {
            res.send({ message: 'Карточка успешно удалена' });
          });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: idUser } }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const deleteLikeCard = (req, res, next) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findByIdAndUpdate(id, { $pull: { likes: idUser } }, { new: true })
    .orFail(() => Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
