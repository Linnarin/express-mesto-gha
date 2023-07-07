const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes/index');

const app = express();

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
