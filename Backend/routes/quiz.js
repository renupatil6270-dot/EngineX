const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const portalFields = {
    dreamer: ['targetRole', 'currentSkillLevel', 'preferredLanguage', 'timeCommitmentHours'],
    achiever: ['currentSemester', 'weakSubjectAreas', 'examTargetGoals', 'prepStrategyPreference'],
    innovator: ['domainInterest', 'techStackProficiency', 'projectIdeaScope', 'hackathonTimeline'],
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

        // 1. Save submission to MongoDB
        const quizResult = new Quiz({
            userId: req.user.userId,
            portalType: String(portalType).toLowerCase(),
            answers
        });
        await quizResult.save();

        res.status(201).json({
            message: 'Quiz submitted successfully',
            quizId: quizResult._id,
        });

    } catch (err) {
        console.error('Quiz Error:', err.message);
        res.status(500).json({ error: 'Failed to process quiz submission' });
    }
});

module.exports = router;