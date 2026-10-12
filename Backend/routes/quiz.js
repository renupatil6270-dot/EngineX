const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const axios = require('axios');
const Roadmap = require('../models/Roadmap');
const { aiServiceUrl, aiServiceTimeoutMs } = require('../config');

// POST /api/quiz/submit
router.post('/submit', auth, async (req, res) => {
    try {
        const { portalType, answers } = req.body;
        const hasValidAnswers = answers
            && typeof answers === 'object'
            && typeof answers.interestedDomain === 'string'
            && answers.interestedDomain.trim().length > 0
            && Number.isInteger(answers.timelineMonths)
            && answers.timelineMonths >= 1
            && answers.timelineMonths <= 60
            && ['targetRoles', 'desiredSkills', 'acquiredSkills'].every(
                (field) => Array.isArray(answers[field]),
            );
        if (!['dreamer', 'pursuer'].includes(portalType) || !hasValidAnswers) {
            return res.status(400).json({ message: 'A valid portalType and answers are required' });
        }

        // 1. Save submission to MongoDB
        const quizResult = new Quiz({
            userId: req.user.id,
            portalType,
            answers
        });
        await quizResult.save();

        // 2. Pass quiz profile to Member 3's AI service for roadmap generation
        let aiResponse = null;
        try {
            const response = await axios.post(aiServiceUrl, {
                userId: req.user.id,
                portalType,
                answers
            }, { timeout: aiServiceTimeoutMs });
            aiResponse = response.data;
        } catch (aiErr) {
            console.error('AI service failed:', aiErr.message);
            return res.status(502).json({
                message: 'Roadmap generation is temporarily unavailable. Please try again.',
                quizId: quizResult._id,
            });
        }

        const savedRoadmap = await Roadmap.create({
            userId: req.user.id,
            quizId: quizResult._id,
            portalType,
            roadmap: aiResponse,
        });

        res.status(201).json({
            message: 'Quiz submitted successfully',
            quizId: quizResult._id,
            roadmapId: savedRoadmap._id,
            roadmap: savedRoadmap.roadmap
        });

    } catch (err) {
        console.error('Quiz Error:', err.message);
        res.status(500).json({ error: 'Failed to process quiz submission' });
    }
});

module.exports = router;