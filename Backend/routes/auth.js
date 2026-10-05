// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your Mongoose User model
const authMiddleware = require('../middleware/auth');

// @route   GET /api/auth/me
// @desc    Get current user profile using JWT token
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.id was attached by authMiddleware
    // .select('-password') excludes the hashed password field from being sent to the client
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching current user:', err.message);
    res.status(500).json({ message: 'Server error while retrieving user session' });
  }
});

module.exports = router;