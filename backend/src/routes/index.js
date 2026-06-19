const express = require('express');
const authRoutes = require('./authRoutes');
const leaveRoutes = require('./leaveRoutes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));

router.use('/auth', authRoutes);
router.use('/leaves', leaveRoutes);

module.exports = router;