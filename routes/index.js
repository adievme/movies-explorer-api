const router = require('express').Router();
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

module.exports = router;
