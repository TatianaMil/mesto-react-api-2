const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const serverError = require('./middlewares/serverError');
const router = require('./routes/router');
const { requestLogger, errorLogger } = require('./utils/Logger');

const { PORT = 3000 } = process.env;
const app = express();

// преобразуем в строку
app.use(express.json());
// подключение роутеров
app.use(router);
// обработка ошибок
app.use(errors());
app.use(serverError);
app.use(cors());
// заголовки
app.use(helmet());
// логгер запросов
app.use(requestLogger);
// логгер ошибок
app.use(errorLogger);

// connect mongoshell:
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    // console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
