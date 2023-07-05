const express = require('express');

const router = express.Router();

const {
  createCard, getCards, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardid', deleteCard);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);
module.exports = router;
