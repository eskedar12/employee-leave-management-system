export function validateLeaveRequest({ leaveType, startDate, endDate, reason }) {
  const errors = {};

  if (!leaveType) {
    errors.leaveType = 'Choose a leave type.';
  }

  if (!startDate) {
    errors.startDate = 'Pick a start date.';
  }

  if (!endDate) {
    errors.endDate = 'Pick an end date.';
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    errors.endDate = 'End date can\u2019t be before the start date.';
  }

  if (!reason || reason.trim().length < 10) {
    errors.reason = 'Add a short reason (at least 10 characters).';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}