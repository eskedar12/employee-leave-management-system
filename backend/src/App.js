const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Employee Leave Management System API' });
});

module.exports = app;