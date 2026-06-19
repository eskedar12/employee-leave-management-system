const { body, param, query } = require('express-validator');
const { LEAVE_TYPES, LEAVE_STATUS } = require('../utils/constants');

const createLeaveValidation = [
  body('leaveType')
    .notEmpty()
    .withMessage('Leave type is required')
    .isIn(LEAVE_TYPES)
    .withMessage(`Leave type must be one of: ${LEAVE_TYPES.join(', ')}`),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().withMessage('End date is required').isISO8601().withMessage('End date must be a valid date'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ max: 1000 })
    .withMessage('Reason must be under 1000 characters'),
];

const updateStatusValidation = [
  param('id').isUUID().withMessage('Invalid leave request id'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED])
    .withMessage(`Status must be one of: ${LEAVE_STATUS.APPROVED}, ${LEAVE_STATUS.REJECTED}`),
  body('reviewerComment').optional().isString().isLength({ max: 1000 }),
];

const listLeaveValidation = [
  query('status').optional().isIn(Object.values(LEAVE_STATUS)),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { createLeaveValidation, updateStatusValidation, listLeaveValidation };