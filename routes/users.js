const express = require('express');

const router = express.Router();

const {
  createUser, getUsers, getUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUsersAvatar);

module.exports = router;
