const express = require('express');
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const {
  calculateRoadmapProgress,
  getRoadmapTopics,
} = require('../services/roadmapProgress');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json({
      roadmaps: roadmaps.map((roadmap) => ({
        ...roadmap,
        progress: calculateRoadmapProgress(
          roadmap.aiResponse,
          (roadmap.progress?.completedTopics || []).map((topic) => topic.topicId),
          Date.now(),
          roadmap.createdAt
        ),
      })),
    });
  } catch (err) {
    console.error('Roadmap retrieval error:', err.message);
    return res.status(500).json({ message: 'Unable to retrieve roadmaps' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
    return res.json({
      roadmap: {
        ...roadmap,
        progress: calculateRoadmapProgress(
          roadmap.aiResponse,
          (roadmap.progress?.completedTopics || []).map((topic) => topic.topicId),
          Date.now(),
          roadmap.createdAt
        ),
      },
    });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid roadmap id' });
  }
});

router.patch('/:id/topics/:topicId', auth, async (req, res) => {
  const { completed } = req.body;
  if (typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'completed must be a boolean' });
  }

  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    const validTopicIds = new Set(getRoadmapTopics(roadmap.aiResponse).map((topic) => topic.id));
    if (!validTopicIds.has(req.params.topicId)) {
      return res.status(400).json({ message: 'Topic does not exist in this roadmap' });
    }

    if (!roadmap.progress) {
      roadmap.progress = { completedTopics: [] };
    }
    const completedTopics = roadmap.progress.completedTopics;
    const alreadyCompleted = completedTopics.some(
      (topic) => topic.topicId === req.params.topicId
    );

    if (completed && !alreadyCompleted) {
      completedTopics.push({ topicId: req.params.topicId });
    } else if (!completed && alreadyCompleted) {
      roadmap.progress.completedTopics = completedTopics.filter(
        (topic) => topic.topicId !== req.params.topicId
      );
    }

    roadmap.progress.completedTopics = completed
      ? completedTopics
      : roadmap.progress.completedTopics;
    roadmap.progress.lastUpdated = new Date();
    await roadmap.save();

    return res.json({
      success: true,
      progress: calculateRoadmapProgress(
        roadmap.aiResponse,
        roadmap.progress.completedTopics.map((topic) => topic.topicId),
        Date.now(),
        roadmap.createdAt
      ),
    });
  } catch (err) {
    console.error('Roadmap progress update error:', err);
    return res.status(500).json({ message: 'Unable to update roadmap progress' });
  }
});

module.exports = router;
