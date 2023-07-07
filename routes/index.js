const express = require('express');

const ERROR_NOT_FOUND = 404;

const router = express.Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
