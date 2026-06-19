const sequelize = require('../config/database');
const User = require('./User');
const LeaveRequest = require('./LeaveRequest');

// Set up associations here
User.hasMany(LeaveRequest, { foreignKey: 'userId', onDelete: 'CASCADE' });
LeaveRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  LeaveRequest,
};