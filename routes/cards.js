const router = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../utils/validation');

const {
  getInitialCards,
  createNewCardApi,
  removeCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

// find cards
router.get('/cards', getInitialCards);
// create cards
router.post('/cards', createCardValidation, createNewCardApi);
// delete cards
router.delete('/cards/:cardId', cardIdValidation, removeCard);
// add likes
router.put('/cards/:cardId/likes', cardIdValidation, addLike);
// remove like from the cards
router.delete('/cards/:cardId/likes', cardIdValidation, removeLike);

module.exports = router;
