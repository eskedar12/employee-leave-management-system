const env = require('../config/env');
const { sendError } = require('../utils/apiResponse');

const notFound = (req, res) => {
  sendError(res, { statusCode: 404, message: `Route not found: ${req.originalUrl}` });
};

// Centralized error handler - every controller/middleware funnels errors
// here via next(err) or the asyncHandler wrapper.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Sequelize unique constraint violation
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with this value already exists.';
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    message = err.errors?.map((e) => e.message).join(', ') || message;
  }

  if (env.nodeEnv === 'development' && !err.isOperational) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  sendError(res, {
    statusCode,
    message,
    errors: env.nodeEnv === 'development' ? { stack: err.stack } : null,
  });
};

module.exports = { notFound, errorHandler };