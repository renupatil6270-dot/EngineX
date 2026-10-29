const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');
const aiRoutes = require('./ai');
const portalFields = {
    dreamer: ['domain', 'careerGoal', 'experience', 'hoursPerWeek'],
    achiever: ['targetExam', 'targetDate', 'hoursPerWeek', 'weakAreas'],
    innovator: ['projectType', 'techStack', 'teamSize', 'projectGoal'],
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

        const roadmap = await aiRoutes.generateRoadmapContent(normalizedPortalType, answers);
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
        });
    } catch (err) {
        console.error('Quiz submission error:', err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to process quiz submission',
        });
    }
});

module.exports = router;