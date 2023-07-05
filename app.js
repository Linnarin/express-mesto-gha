const express = require('express');

const mongoose = require('mongoose');

const app = express();

const router = express.Router();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a1c94212f12f7b25482f1d',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
