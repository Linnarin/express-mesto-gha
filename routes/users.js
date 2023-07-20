const express = require('express');

const router = express.Router();

const {
  getUsers,
  getCurrentUser,
  updateUser,
  updateUsersAvatar,
} = require('../controllers/users');

const validation = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validation.validateUserId, getCurrentUser);
router.patch('/me', validation.validateUpdateUser, updateUser);
router.patch('/me/avatar', validation.validateUserAvatar, updateUsersAvatar);

module.exports = router;
