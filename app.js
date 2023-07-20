const express = require('express');

const mongoose = require('mongoose');

const app = express();

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const router = require('./routes/index');

const error = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(error);
app.listen(3000, () => {
  console.log('Сервер запущен!');
});
