// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your Mongoose User model
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const issueToken = (user) => jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: jwtExpiresIn });

router.post('/signup', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 100 || !emailPattern.test(email) || password.length < 8) {
      return res.status(400).json({ message: 'Name, valid email, and password of at least 8 characters are required' });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ user: publicUser(user), token: issueToken(user) });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ message: 'Unable to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({ user: publicUser(user), token: issueToken(user) });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Unable to sign in' });
  }
});

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

    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('Error fetching current user:', err.message);
    res.status(500).json({ message: 'Server error while retrieving user session' });
  }
});

module.exports = router;