const router = require('express').Router();
const { userIdValidation, updateProfileUserValidation, updateProfileAvatarValidation } = require('../utils/validation');

const {
  getUsers,
  getUserId,
  createUser,
  getUser,
  editProfileUserApi,
  updateProfileUserAvatar,
} = require('../controllers/users');

// find everyone users
router.get('/users', getUsers);
// info about user
router.get('/users/me', getUser);
// find users id
router.get('/users/:userId', userIdValidation, getUserId);
// create new user
router.post('/users', createUser);
// edit profile
router.patch('/users/me', updateProfileUserValidation, editProfileUserApi);
// avatar update
router.patch('/users/me/avatar', updateProfileAvatarValidation, updateProfileUserAvatar);

module.exports = router;
