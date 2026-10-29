const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Roadmap = require('../models/Roadmap');

const router = express.Router();
const GEMINI_MODEL = 'gemini-3.8-flash';

const portalFields = {
  dreamer: ['domain', 'careerGoal', 'experience', 'hoursPerWeek'],
  achiever: ['targetExam', 'targetDate', 'hoursPerWeek', 'weakAreas'],
  innovator: ['projectType', 'techStack', 'teamSize', 'projectGoal'],
};

const portalGuidance = {
  dreamer: 'Create a foundational, step-by-step skill acquisition timeline for a beginner or career switcher.',
  achiever: 'Create a deadline-driven review schedule with milestone target dates leading to the target date.',
  innovator: 'Create an architecture and build-phase roadmap covering MVP setup, backend routes, testing, and deployment.',
};

function cleanJsonResponse(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function isRoadmap(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof value.title === 'string' &&
    typeof value.summary === 'string' &&
    Array.isArray(value.phases) &&
    value.phases.every(
      (phase) =>
        phase &&
        typeof phase.phaseName === 'string' &&
        typeof phase.duration === 'string' &&
        typeof phase.targetDate === 'string' &&
        Array.isArray(phase.topics) &&
        Array.isArray(phase.projects)
    )
  );
}

async function generateRoadmapContent(portalType, answers) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Gemini AI is not configured. Set GEMINI_API_KEY in the backend environment.');
    error.statusCode = 503;
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
You are an expert learning-path designer creating a practical personalized roadmap.
Return ONLY a valid JSON object. Do not include markdown, code fences, commentary, or extra keys.
The JSON must exactly follow this structure:
{
  "title": "Roadmap Title",
  "summary": "Short summary",
  "phases": [
    {
      "phaseName": "Phase Name",
      "duration": "Duration",
      "targetDate": "Milestone target date or week",
      "topics": ["Topic 1", "Topic 2"],
      "projects": ["Project 1"]
    }
  ]
}

Portal type: ${portalType}
Portal guidance: ${portalGuidance[portalType]}
Student choices:
${JSON.stringify(answers, null, 2)}

Make the roadmap achievable, sequential, and specific. Include 3 to 5 phases. Every phase must have at least two topics and one project. Tailor the phase names and projects to the selected portal.
  `.trim();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const responseText = response.text;
  if (!responseText) {
    const error = new Error('Gemini returned an empty response');
    error.statusCode = 502;
    throw error;
  }

  const roadmap = JSON.parse(cleanJsonResponse(responseText));
  if (!isRoadmap(roadmap)) {
    const error = new Error('Gemini returned an invalid roadmap format');
    error.statusCode = 502;
    throw error;
  }

  return roadmap;
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
    const roadmap = await generateRoadmapContent(
      normalizedPortalType,
      answers
    );
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
    });
  } catch (aiError) {
    console.error('Portal Roadmap Error:', normalizedPortalType, aiError);
    return res.status(aiError.statusCode || 500).json({
      success: false,
      message: 'Unable to generate a roadmap right now. Please try again.',
    });
  }
});

router.generateRoadmapContent = generateRoadmapContent;

module.exports = router;
