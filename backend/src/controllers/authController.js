const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const config = require('../config/environment');

const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    logger.warn('Login attempt with missing email or password');
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    logger.info(`User logged in successfully: ${email}`);
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Error during login:', error);
    next(error);
  }
};

// This is just for creating a test user. In a real app, you'd have a proper register flow.
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await User.create({ name, email, password, role });
        createSendToken(newUser, 201, res);
    } catch (error) {
        logger.error('Error during registration:', error);
        res.status(400).json({ success: false, message: 'Could not create user', error: error.message });
    }
};
