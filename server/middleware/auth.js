const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies the JWT in the Authorization header (Bearer <token>) and
 * attaches the authenticated user to req.user. Responds 401 if the
 * token is missing, malformed, expired, or the user no longer exists.
 */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const token = header.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Server misconfiguration: JWT_SECRET is not set' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
