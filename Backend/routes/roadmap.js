const express = require('express');
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json({ roadmaps });
  } catch (err) {
    console.error('Roadmap retrieval error:', err.message);
    return res.status(500).json({ message: 'Unable to retrieve roadmaps' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
    return res.json({ roadmap });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid roadmap id' });
  }
});

module.exports = router;
