const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

const {
  movieValidate,
  idValidate,
} = require('../validator/validator');

router.get('/', getMovies);
router.post('/', movieValidate, createMovie);
router.delete('/:id', idValidate, deleteMovie);

module.exports = router;
