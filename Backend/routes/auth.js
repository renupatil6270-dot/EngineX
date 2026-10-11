const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ id: user._id.toString() }, secret, { expiresIn: '7d' });
}

function validateCredentials({ name, email, password }, requireName = false) {
  if (requireName && (typeof name !== 'string' || name.trim().length < 2)) {
    return 'Name must contain at least 2 characters';
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'A valid email is required';
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must contain at least 8 characters';
  }
  return null;
}

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  const validationError = validateCredentials({ name, email, password }, true);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'An account already exists for this email' });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
    });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account already exists for this email' });
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Unable to create account' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const validationError = validateCredentials({ email, password });
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Unable to sign in' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Profile error:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve user session' });
  }
});

module.exports = router;
