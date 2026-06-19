const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const register = async ({ fullName, username, password, role }) => {
  const existing = await User.findOne({ where: { username } });
  if (existing) {
    throw new Error('That username is already taken.');
  }

  const user = await User.create({
    fullName,
    username,
    password,
    role: role || 'employee',
  });

  const token = signToken(user);
  return { 
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }, 
    token 
  };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Incorrect username or password.');
  }

  // COMPARE PLAIN TEXT PASSWORDS
  if (password !== user.password) {
    throw new Error('Incorrect username or password.');
  }

  const token = signToken(user);
  return { 
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }, 
    token 
  };
};

module.exports = { register, login, signToken };