// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_change_me';

module.exports = function authMiddleware(req, res, next) {
  const [scheme, token] = (req.header('Authorization') || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    req.user.id = req.user.id || req.user.userId;
    if (!req.user.id) {
      return res.status(401).json({ message: 'Token does not identify a user' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
