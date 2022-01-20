const router = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

const { userUpdateValidate } = require('../validator/validator');

router.get('/me', getUser);
router.patch('/me', userUpdateValidate, updateUser);

module.exports = router;
