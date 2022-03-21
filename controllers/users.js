require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnAuthorizedError = require('../errors/UnAuthorizedError');

// возвращает информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      throw new ConflictError('Пользователь с таким email уже существует.');
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
    );
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    email,
    name,
    password,
  } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      throw new ConflictError('Такой email уже зарегистрирован');
    }
    return bcrypt.hash(password, 10);
  })
    .then((hash) => User.create({
      password: hash,
      email,
      name,
    }))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не создан');
      }
      res.status(201).send({
        _id: user.id,
        email,
        name,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' },
          );
          res.send({ token });

          return token;
        });
    })
    .catch((err) => {
      next(new UnAuthorizedError(err.message));
    });
};

module.exports = {
  getUser,
  updateUser,
  login,
  createUser,
};
