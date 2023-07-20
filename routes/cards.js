const express = require('express');

const router = express.Router();

const {
  createCard, getCards, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

const validator = require('../middlewares/validator');

router.post('/', validator.validateCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validator.validateCardId, deleteCard);
router.put('/:cardId/likes', validator.validateCardId, likeCard);
router.delete('/:cardId/likes', validator.validateCardId, deleteLikeCard);
module.exports = router;
