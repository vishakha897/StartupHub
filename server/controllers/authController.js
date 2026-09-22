const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with that email already exists', 409);
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

// PUT /api/auth/me  (used by Profile page — name only, per spec)
const updateMe = asyncHandler(async (req, res) => {
  const { name, theme } = req.body;

  if (name !== undefined) {
    if (!name.trim() || name.trim().length < 2) {
      throw new AppError('Name must be at least 2 characters', 400);
    }
    req.user.name = name.trim();
  }
  if (theme !== undefined) {
    if (!['light', 'dark'].includes(theme)) {
      throw new AppError('Invalid theme value', 400);
    }
    req.user.theme = theme;
  }

  await req.user.save();
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe, updateMe };
