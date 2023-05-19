const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// find everyone users
function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

// find users id
function getUserId(req, res, next) {
  User
    .findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.status(200).send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные профиля'));
        return;
      }
      next(err);
    });
}

// create new user
function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
    });
}

// info about this user
function getUser(req, res, next) {
  User.findById(req.user._id).orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
  //     return;
  //   }
  //   next(err);
  // });
}

// edit profile
function editProfileUserApi(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => { throw new NotFoundError('Пользователь с указанным _id не найден'); })
    .then((user) => {
      res.status(200).json({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
}

// avatar update
function updateProfileUserAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((user) => {
      res.status(200).json({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
}

// create user login and create token and return it
function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
}

module.exports = {
  login,
  getUsers,
  getUserId,
  createUser,
  getUser,
  editProfileUserApi,
  updateProfileUserAvatar,
};
