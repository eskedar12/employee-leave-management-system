const { body } = require('express-validator');
const { ROLES } = require('../utils/constants');

const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };