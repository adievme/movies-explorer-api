const router = require('express').Router();

const { userValidate, loginValidate } = require('../validator/validator');
const { login, createUser } = require('../controllers/users');

router.post('/signup', userValidate, createUser);
router.post('/signin', loginValidate, login);

module.exports = router;
