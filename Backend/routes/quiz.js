const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

        // 2. Generate Roadmap with Gemini
        let aiResponse = null;
        try {
            const prompt = `Generate a structured step-by-step learning roadmap for a ${portalType} learner with these preferences: ${JSON.stringify(answers)}. Return raw JSON only with keys: title, description, and steps (array of { phase, topics, project }).`;

            const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
            });

            let text = response.text;
            // Clean potential markdown blocks
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            aiResponse = JSON.parse(text);

        } catch (aiError) {
            console.error('Gemini call failed:', aiError);
        }

        res.json({
            success: true,
            quizResult,
            roadmap: aiResponse
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ error: 'Server error during submission' });
    }
});

module.exports = router;