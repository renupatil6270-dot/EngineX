const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');
const aiRoutes = require('./ai');
const { calculateRoadmapProgress } = require('../services/roadmapProgress');
const portalFields = {
    dreamer: ['academicStage', 'favoriteSubject', 'primaryGoal', 'hoursPerWeek'],
    achiever: ['engineeringYear', 'careerObjective', 'milestoneTimeline', 'hoursPerWeek'],
    innovator: ['ventureStage', 'biggestBottleneck', 'launchHorizon', 'builderHoursPerWeek'],
};

// POST /api/quiz/submit
router.post('/submit', auth, async (req, res) => {
    try {
        const { portalType, answers } = req.body;
        const requiredFields = portalFields[String(portalType || '').toLowerCase()];

        if (!requiredFields || !answers || typeof answers !== 'object') {
            return res.status(400).json({
                error: 'A valid portalType and answers object are required'
            });
        }

        const missingFields = requiredFields.filter(
            (field) =>
                answers[field] === undefined ||
                answers[field] === null ||
                String(answers[field]).trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required answer fields: ${missingFields.join(', ')}`,
            });
        }

        const normalizedPortalType = String(portalType).toLowerCase();
        const quizResult = new Quiz({
            user: req.user.id,
            portalType: normalizedPortalType,
            answers
        });
        await quizResult.save();

        const result = await aiRoutes.generateRoadmapContent(normalizedPortalType, answers);
        const roadmap = result.roadmap;
        const generationSource = result.generationSource;
        const roadmapResult = new Roadmap({
            userId: req.user.id,
            portalType: normalizedPortalType,
            aiResponse: roadmap,
        });
        await roadmapResult.save();

        return res.status(201).json({
            success: true,
            roadmap,
            roadmapId: roadmapResult._id,
            quizId: quizResult._id,
            progress: calculateRoadmapProgress(roadmap),
            generationSource,
        });
    } catch (err) {
        console.error('Quiz submission error:', err);
        if (Number(err.statusCode) === 429) {
            res.set('Retry-After', String(err.retryAfterSeconds || 30));
        }
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to process quiz submission',
        });
    }
});

module.exports = router;