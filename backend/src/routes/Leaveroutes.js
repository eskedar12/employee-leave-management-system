const express = require('express');
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/leaveController');
const { auth, isManager } = require('../middleware/auth');

const router = express.Router();

router.post('/request', auth, createRequest);
router.get('/my-requests', auth, getMyRequests);
router.get('/all', auth, isManager, getAllRequests);
router.put('/:id/approve', auth, isManager, approveRequest);
router.put('/:id/reject', auth, isManager, rejectRequest);

module.exports = router;