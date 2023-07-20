const express = require('express');

const router = express.Router();

const {
  createCard,
  getCards,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const validation = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validation.validateCreateCard, createCard);
router.delete('/:cardId', validation.validateCardId, deleteCard);
router.put('/:cardId/likes', validation.validateCardId, putLikeCard);
router.delete('/:cardId/likes', validation.validateCardId, deleteLikeCard);
module.exports = router;
