const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validator');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const createUserValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
  body('email').trim().isEmail().withMessage('E-mail inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres'),
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('O nome não pode estar vazio'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('E-mail inválido'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres'),
];

function createUserRoutes(role) {
  const router = express.Router();

  router.get('/', protect, (req, res, next) => {
    userController.listByRole(role)(req, res, next);
  });

  router.get('/:id', protect, (req, res, next) => {
    userController.getById(req, res, next);
  });

  router.post(
    '/',
    protect,
    restrictTo('admin', 'professor'),
    createUserValidation,
    validateRequest,
    (req, res, next) => {
      userController.create(role)(req, res, next);
    }
  );

  router.put(
    '/:id',
    protect,
    restrictTo('admin', 'professor'),
    updateUserValidation,
    validateRequest,
    (req, res, next) => {
      userController.update(req, res, next);
    }
  );

  router.delete(
    '/:id',
    protect,
    restrictTo('admin', 'professor'),
    (req, res, next) => {
      userController.delete(req, res, next);
    }
  );

  return router;
}

module.exports = createUserRoutes;
