const express = require('express');

const router = express.Router();

const {
  getUsers, getCurrentUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

const validator = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/:id', validator.validateUserId, getCurrentUser);
router.get('/me', getCurrentUser);
router.patch('/me', validator.validateUpdateUser, updateUser);
router.patch('/me/avatar', validator.validateUserAvatar, updateUsersAvatar);

module.exports = router;
