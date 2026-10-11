const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');

const router = express.Router();
const MAX_TIMELINE_MONTHS = 60;

function validateAnswers(answers) {
  if (!answers || typeof answers !== 'object') return 'Answers are required';
  if (typeof answers.interestedDomain !== 'string' || !answers.interestedDomain.trim()) {
    return 'Interested domain is required';
  }
  if (!Number.isInteger(answers.timelineMonths) || answers.timelineMonths < 1 || answers.timelineMonths > MAX_TIMELINE_MONTHS) {
    return `Timeline must be between 1 and ${MAX_TIMELINE_MONTHS} months`;
  }
  return null;
}

function validateRoadmap(data) {
  if (!data || typeof data !== 'object') return false;
  return typeof data.title === 'string'
    && typeof data.targetRole === 'string'
    && Number.isInteger(data.durationMonths)
    && Array.isArray(data.phases)
    && Array.isArray(data.skillGaps)
    && Array.isArray(data.projects);
}

router.post('/submit', auth, async (req, res) => {
  const { portalType, answers } = req.body || {};
  if (!['dreamer', 'pursuer'].includes(portalType)) {
    return res.status(400).json({ message: 'A valid portal type is required' });
  }
  const validationError = validateAnswers(answers);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const quiz = await Quiz.create({ userId: req.user.id, portalType, answers });
    let aiResponse;
    try {
      const response = await axios.post(process.env.AI_SERVICE_URL, {
        userId: req.user.id,
        portalType,
        answers,
      }, { timeout: 15000, maxContentLength: 1024 * 1024 });
      aiResponse = response.data;
    } catch (error) {
      console.error('AI service error:', error.message);
      return res.status(503).json({ message: 'Roadmap service is temporarily unavailable', quizId: quiz._id });
    }

    if (!validateRoadmap(aiResponse)) {
      return res.status(502).json({ message: 'Roadmap service returned invalid data', quizId: quiz._id });
    }

    const roadmap = await Roadmap.create({
      user: req.user.id,
      quiz: quiz._id,
      targetRole: aiResponse.targetRole,
      durationMonths: aiResponse.durationMonths,
      data: aiResponse,
    });
    return res.status(201).json({ message: 'Quiz submitted successfully', quizId: quiz._id, roadmap });
  } catch (error) {
    console.error('Quiz submission error:', error.message);
    return res.status(500).json({ message: 'Unable to process quiz submission' });
  }
});

module.exports = router;
