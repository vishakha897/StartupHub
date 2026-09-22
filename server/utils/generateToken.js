const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for the given user id. Expires in 7 days.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;
