const express = require('express');

const router = express.Router();

const {
  getUsers, getCurrentUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

const celebrate = require('../middlewares/celebrate');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate.validateUserId, getCurrentUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);
router.patch('/me/avatar', celebrate.validateUserAvatar, updateUsersAvatar);

module.exports = router;
