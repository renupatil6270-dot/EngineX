const express = require('express');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');
const { calculateRoadmapProgress } = require('../services/roadmapProgress');
const { generateRoadmapWithGemini } = require('../services/geminiRoadmap');

const router = express.Router();

const portalFields = {
  dreamer: ['academicStage', 'favoriteSubject', 'primaryGoal', 'hoursPerWeek'],
  achiever: ['engineeringYear', 'careerObjective', 'milestoneTimeline', 'hoursPerWeek'],
  innovator: ['ventureStage', 'biggestBottleneck', 'launchHorizon', 'builderHoursPerWeek'],
};

async function generateRoadmapContent(portalType, answers) {
  return generateRoadmapWithGemini(portalType, answers);
}

router.post('/generate-roadmap', auth, async (req, res) => {
  const { portalType } = req.body;
  const normalizedPortalType = String(portalType || '').toLowerCase();
  const requiredFields = portalFields[normalizedPortalType];

  if (!requiredFields) {
    return res.status(400).json({
      message: 'portalType must be one of: dreamer, achiever, innovator',
    });
  }

  const missingFields = requiredFields.filter(
    (field) =>
      req.body[field] === undefined ||
      req.body[field] === null ||
      String(req.body[field]).trim() === ''
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required quiz fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    const answers = Object.fromEntries(
      requiredFields.map((field) => [field, req.body[field]])
    );
    const result = await generateRoadmapContent(
      normalizedPortalType,
      answers
    );
    const roadmap = result.roadmap;
    const generationSource = result.generationSource;
    const quizResult = await Quiz.create({
      user: req.user.id,
      portalType: normalizedPortalType,
      answers,
    });
    const roadmapResult = await Roadmap.create({
      userId: req.user.id,
      portalType: normalizedPortalType,
      aiResponse: roadmap,
    });
    return res.status(201).json({
      success: true,
      roadmap,
      roadmapId: roadmapResult._id,
      quizId: quizResult._id,
      progress: calculateRoadmapProgress(roadmap),
      generationSource,
    });
  } catch (aiError) {
    console.error('Portal Roadmap Error:', normalizedPortalType, aiError);
    if (Number(aiError.statusCode) === 429) {
      res.set('Retry-After', String(aiError.retryAfterSeconds || 30));
    }
    return res.status(aiError.statusCode || 500).json({
      success: false,
      message: 'Unable to generate a roadmap right now. Please try again.',
    });
  }
});

router.generateRoadmapContent = generateRoadmapContent;

module.exports = router;
