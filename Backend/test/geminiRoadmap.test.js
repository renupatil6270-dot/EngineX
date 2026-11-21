const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateDeterministicFallback,
  getStatusCode,
  getRetryAfterSeconds,
} = require('../services/geminiRoadmap');

test('extracts provider status codes from Gemini errors', () => {
  assert.equal(getStatusCode({ status: 429 }), 429);
  assert.equal(getStatusCode({ error: { code: 503 } }), 503);
});

test('uses a clear default Retry-After interval', () => {
  assert.equal(getRetryAfterSeconds({ retryAfter: '45' }), 45);
  assert.equal(getRetryAfterSeconds({ headers: { 'retry-after': '12' } }), 12);
  assert.equal(getRetryAfterSeconds({ message: 'temporarily unavailable' }), 30);
});

test('deterministic fallback has the required roadmap shape and source data', () => {
  const roadmap = generateDeterministicFallback('dreamer', {
    academicStage: 'Class 12 (Board + Entrance Prep)',
    favoriteSubject: 'Coding, Computers & AI',
    primaryGoal: 'Choose the right B.Tech branch',
    hoursPerWeek: '9–12 hours',
  });

  assert.equal(typeof roadmap.title, 'string');
  assert.equal(typeof roadmap.summary, 'string');
  assert.ok(roadmap.phases.length >= 3);
  assert.ok(roadmap.phases.every((phase) =>
    phase.phaseName &&
    phase.duration &&
    phase.targetDate &&
    phase.topics.length >= 2 &&
    phase.projects.length >= 1
  ));
});

test('dreamer fallback reflects entrance preparation and branch exploration', () => {
  const roadmap = generateDeterministicFallback('dreamer', {
    academicStage: 'Class 12 (Board + Entrance Prep)',
    favoriteSubject: 'Coding, Computers & AI',
    primaryGoal: 'Crack JEE / CET / Engineering Entrance',
    hoursPerWeek: '9–12 hours',
  });

  assert.match(roadmap.title, /JEE|entrance|Engineering/i);
  assert.match(JSON.stringify(roadmap), /Entrance|branch|B\.Tech/i);
});

test('achiever fallback reflects the semester and placement track', () => {
  const roadmap = generateDeterministicFallback('achiever', {
    engineeringYear: '3rd Year (Internships & Pre-Placement)',
    careerObjective: 'Software / Full-Stack & DSA Placements',
    milestoneTimeline: 'In 1–3 months',
    hoursPerWeek: '12+ hours',
  });

  assert.match(roadmap.title, /Software|Full-Stack/i);
  assert.match(JSON.stringify(roadmap), /Placement|DSA|Mock/i);
});

test('innovator fallback reflects the startup bottleneck and launch horizon', () => {
  const roadmap = generateDeterministicFallback('innovator', {
    ventureStage: 'Live Product with Early Users',
    biggestBottleneck: 'Business Model, Pitching & Go-To-Market',
    launchHorizon: 'In 3–6 months (Incubation / Seed Pitch)',
    builderHoursPerWeek: '13–20 hours',
  });

  assert.match(roadmap.title, /Live Product|Venture/i);
  assert.match(JSON.stringify(roadmap), /pitch|GTM|Customer/i);
});
