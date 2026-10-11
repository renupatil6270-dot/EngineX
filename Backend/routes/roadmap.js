const express = require('express');
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json({ roadmaps });
  } catch (error) {
    console.error('Roadmap retrieval error:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve roadmaps' });
  }
});

module.exports = router;
