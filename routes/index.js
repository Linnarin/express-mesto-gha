const express = require('express');
const { auth } = require('../middlewares/auth');
const celebrate = require('../middlewares/celebrate');

const router = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/signin', celebrate.validateCreateAndLoginUser, login);
router.use('/signup', celebrate.validateCreateAndLoginUser, createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

module.exports = router;
