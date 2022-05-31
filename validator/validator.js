const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const userValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const userUpdateValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const idValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateURL = (value) => {
  const result = isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Неправильный формат ссылки');
};

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(300),
    director: Joi.string().required().min(2).max(600),
    duration: Joi.number().required(),
    year: Joi.string().length(4).regex(/^[0-9]+$/).required(),
    description: Joi.string().required().min(2).max(2000),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(300),
    nameEN: Joi
      .string()
      .alphanum()
      .min(3)
      .max(300)
      .required(),
  }),
});

module.exports = {
  userValidate,
  loginValidate,
  userUpdateValidate,
  idValidate,
  movieValidate,
};
