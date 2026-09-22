const express = require('express');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
