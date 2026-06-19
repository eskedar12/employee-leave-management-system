const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

// Runs after express-validator check chains and short-circuits the request
// with a consistent 422 response if any field failed validation.
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validateRequest;