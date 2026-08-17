const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const axios = require('axios');

// POST /api/quiz/submit
router.post('/submit', auth, async (req, res) => {
    try {
        const { portalType, answers } = req.body;

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
            const response = await axios.post(process.env.AI_SERVICE_URL, {
                userId: req.user.id,
                portalType,
                answers
            });
            aiResponse = response.data;
        } catch (aiErr) {
            console.warn('AI Service unavailable, saved to DB only:', aiErr.message);
        }

        res.status(201).json({
            message: 'Quiz submitted successfully',
            quizId: quizResult._id,
            roadmap: aiResponse
        });

    } catch (err) {
        console.error('Quiz Error:', err.message);
        res.status(500).json({ error: 'Failed to process quiz submission' });
    }
});

module.exports = router;