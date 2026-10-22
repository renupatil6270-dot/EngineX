const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const auth = require('../middleware/auth');

const router = express.Router();

const portalFields = {
  dreamer: ['targetRole', 'currentSkillLevel', 'preferredLanguage', 'timeCommitmentHours'],
  achiever: ['currentSemester', 'weakSubjectAreas', 'examTargetGoals', 'prepStrategyPreference'],
  innovator: ['domainInterest', 'techStackProficiency', 'projectIdeaScope', 'hackathonTimeline'],
};

const portalGuidance = {
  dreamer: 'Focus on stream selection, software engineering skills, and a practical skill-building roadmap.',
  achiever: 'Focus on academic performance, semester priorities, exam preparation, and study strategy.',
  innovator: 'Focus on project execution, hackathon readiness, technical depth, and a shippable project plan.',
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
          Array.isArray(phase.topics) &&
          Array.isArray(phase.projects)
      )
  );
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

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: 'Gemini AI is not configured. Set GEMINI_API_KEY in the backend environment.',
    });
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
      "topics": ["Topic 1", "Topic 2"],
      "projects": ["Project 1"]
    }
  ]
}

Portal type: ${normalizedPortalType}
Portal guidance: ${portalGuidance[normalizedPortalType]}
Student choices:
${JSON.stringify(req.body, null, 2)}

Make the roadmap achievable, sequential, and specific. Include 3 to 5 phases. Every phase must have at least two topics and one project. Tailor the phase names and projects to the selected portal.
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(502).json({ message: 'Gemini returned an empty response' });
    }

    const roadmap = JSON.parse(cleanJsonResponse(responseText));
    if (!isRoadmap(roadmap)) {
      return res.status(502).json({ message: 'Gemini returned an invalid roadmap format' });
    }

    return res.json(roadmap);
  } catch (error) {
    console.error('Roadmap generation failed:', error.message);
    return res.status(502).json({
      message: 'Unable to generate a roadmap right now. Please try again.',
    });
  }
});

module.exports = router;
