const { LeaveRequest, User } = require('../models');

const createRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    const request = await LeaveRequest.create({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await LeaveRequest.findByPk(id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'approved';
    await request.save();
    
    res.json({ message: 'Request approved', request });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ message: 'Failed to approve request' });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await LeaveRequest.findByPk(id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Request rejected', request });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Failed to reject request' });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest
};