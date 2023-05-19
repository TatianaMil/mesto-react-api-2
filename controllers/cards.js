const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// downloading cards from the server
function getInitialCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

// create a new card from the server
function createNewCardApi(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })

    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
}

// delete card
function removeCard(req, res, next) {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(() => { throw new NotFoundError('карточка не найдена'); })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(cardId)
          .then((item) => { res.status(200).send(item); });
      }
      throw new ForbiddenError('В доступе отказано');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена'));
        return;
      }
      next(err);
    });
}

// add like for the cards
function addLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
        return;
      }
      next(err);
    });
}

// remove like for the cards
function removeLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Передан несуществующий _id карточки'); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
        return;
      }
      next(err);
    });
}

module.exports = {
  getInitialCards,
  createNewCardApi,
  removeCard,
  addLike,
  removeLike,
};
