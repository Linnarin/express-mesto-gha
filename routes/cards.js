const express = require('express');

const router = express.Router();

const {
  createCard, getCards, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

const celebrate = require('../middlewares/celebrate');

router.post('/', celebrate.validateCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrate.validateCardId, deleteCard);
router.put('/:cardId/likes', celebrate.validateCardId, putLikeCard);
router.delete('/:cardId/likes', celebrate.validateCardId, deleteLikeCard);
module.exports = router;