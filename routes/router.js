const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { validationLogin, validationCreateUser } = require('../utils/validation');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
} = require('../controllers/users');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(auth);
router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(userRoutes); // '/users'
router.use(cardRoutes); // '/cards'

router.get('/*', (req, res, next) => {
  /* console.log(JSON.stringify(req, null, 4)); */
  // console.log(Object.values(req));
  next(new NotFoundError('404: Страница не найдена.'));
});

module.exports = router;
