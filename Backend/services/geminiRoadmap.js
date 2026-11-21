const { GoogleGenAI } = require('@google/genai');

const PRIMARY_MODEL = 'gemini-3.8-flash';
const RETRY_DELAYS_MS = [1500, 4000, 9000];
const RETRY_ATTEMPTS = 3;
const GEMINI_REQUEST_TIMEOUT_MS = 15000;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getStatusCode(error) {
  return Number(
    error?.status ||
    error?.statusCode ||
    error?.code ||
    error?.error?.code ||
    0
  );
}

function getRetryAfterSeconds(error) {
  const direct = error?.retryAfter ?? error?.headers?.['retry-after'];
  if (direct !== undefined && direct !== null) {
    const seconds = Number(direct);
    if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  }

  const message = String(error?.message || '');
  const match = message.match(/retry[^0-9]*([0-9]+)/i);
  return match ? Number(match[1]) : 30;
}

function logProviderEvent(statusCode, modelName, attempt, latencyMs) {
  const event = statusCode === 429
    ? 'Gemini quota/rate-limit'
    : 'Gemini temporary provider capacity';
  console.warn(JSON.stringify({
    event,
    httpStatus: statusCode,
    model: modelName,
    attempt,
    latencyMs,
  }));
}

async function retryGeminiModel(ai, modelName, prompt) {
  let lastError;

  for (let callNumber = 1; callNumber <= RETRY_ATTEMPTS + 1; callNumber += 1) {
    const startedAt = Date.now();
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        }),
        new Promise((_, reject) => {
          const timeout = setTimeout(() => {
            const error = new Error('Gemini request timed out');
            error.statusCode = 503;
            error.status = 503;
            reject(error);
          }, GEMINI_REQUEST_TIMEOUT_MS);
          timeout.unref?.();
        }),
      ]);
      return response;
    } catch (error) {
      lastError = error;
      const statusCode = getStatusCode(error);
      const latencyMs = Date.now() - startedAt;

      if (statusCode === 429 || statusCode === 503) {
        logProviderEvent(statusCode, modelName, callNumber, latencyMs);

        if (callNumber <= RETRY_ATTEMPTS) {
          const retryIndex = callNumber - 1;
          const delay = RETRY_DELAYS_MS[retryIndex]
            + Math.floor(Math.random() * 400);
          await sleep(delay);
        }
      } else {
        throw error;
      }
    }
  }

  lastError.statusCode = getStatusCode(lastError) || 503;
  if (lastError.statusCode === 429) {
    lastError.retryAfterSeconds = getRetryAfterSeconds(lastError);
  }
  throw lastError;
}

async function getVerifiedFallbackModel(ai) {
  const configuredFallback = process.env.GEMINI_FALLBACK_MODEL;
  if (!configuredFallback) return null;

  try {
    const models = ai.models.list();
    const names = new Set();

    if (models && typeof models[Symbol.asyncIterator] === 'function') {
      for await (const page of models) {
        for (const model of page?.models || page?.items || []) {
          if (model?.name) names.add(model.name.replace(/^models\//, ''));
        }
      }
    } else {
      const listed = await models;
      for (const model of listed?.models || listed?.items || listed?.page || []) {
        if (model?.name) names.add(model.name.replace(/^models\//, ''));
      }
    }

    return names.has(configuredFallback) ? configuredFallback : null;
  } catch (error) {
    console.warn(JSON.stringify({
      event: 'Gemini fallback model verification failed',
      model: configuredFallback,
      error: error.message,
    }));
    return null;
  }
}

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
    typeof value.title === 'string' &&
    typeof value.summary === 'string' &&
    Array.isArray(value.phases) &&
    value.phases.every((phase) =>
      phase &&
      typeof phase.phaseName === 'string' &&
      typeof phase.duration === 'string' &&
      typeof phase.targetDate === 'string' &&
      Array.isArray(phase.topics) &&
      Array.isArray(phase.projects)
    )
  );
}

function generateDeterministicFallback(portalType, answers) {
  if (portalType === 'dreamer') {
    const stage = answers.academicStage || 'Pre-engineering';
    const interest = answers.favoriteSubject || 'Engineering fundamentals';
    const goal = answers.primaryGoal || 'Choose the right engineering path';
    const hours = answers.hoursPerWeek || 'Flexible weekly commitment';
    const subjects = interest.includes('Coding')
      ? ['Programming fundamentals', 'Python or C++ problem solving']
      : interest.includes('Physics') || interest.includes('Mechanics')
        ? ['Physics fundamentals', 'Electronics and mechanics problem solving']
        : interest.includes('Chemistry')
          ? ['Chemistry fundamentals', 'Sustainability and biotech applications']
          : ['Mathematics fundamentals', 'Quantitative reasoning and logic'];

    return {
      title: `${goal} - Pre-Engineering Roadmap`,
      summary: `A ${stage.toLowerCase()} plan for ${goal.toLowerCase()}, with ${hours.toLowerCase()} reserved for foundation building and branch exploration.`,
      phases: [
        {
          phaseName: 'Foundation Assessment',
          duration: 'Weeks 1-2',
          targetDate: 'End of week 2',
          topics: subjects,
          projects: [`Create a ${interest.toLowerCase()} interest and branch-exploration mini project`],
        },
        {
          phaseName: 'Entrance Preparation System',
          duration: 'Weeks 3-6',
          targetDate: 'End of week 6',
          topics: ['JEE/CET topic prioritization', 'Timed weekly mock and error log'],
          projects: ['Build a subject-wise revision tracker and attempt a full-length mock'],
        },
        {
          phaseName: 'Engineering Branch Discovery',
          duration: 'Weeks 7-10',
          targetDate: 'End of week 10',
          topics: ['B.Tech branch curriculum comparison', 'Career scope and placement outcomes'],
          projects: ['Complete a branch scorecard and interview two students or professionals'],
        },
        {
          phaseName: 'Beginner Proof-of-Skill',
          duration: 'Weeks 11-12',
          targetDate: 'End of week 12',
          topics: ['Project planning', 'Basics of Git, documentation, and presentation'],
          projects: ['Ship a beginner coding or hardware project connected to the preferred interest'],
        },
      ],
    };
  }

  if (portalType === 'achiever') {
    const year = answers.engineeringYear || 'Engineering student';
    const objective = answers.careerObjective || 'Placement readiness';
    const timeline = answers.milestoneTimeline || 'Upcoming milestone';
    const hours = answers.hoursPerWeek || 'Flexible weekly commitment';
    const track = objective.includes('Software') || objective.includes('Full-Stack')
      ? ['DSA patterns and problem solving', 'Full-stack system-building fundamentals']
      : objective.includes('Data Science')
        ? ['Statistics and Python for ML', 'Data pipelines and model evaluation']
        : objective.includes('Core Engineering')
          ? ['Core subject revision and GATE fundamentals', 'Technical projects and research methods']
          : ['Product thinking and case studies', 'Business, consulting, and communication frameworks'];

    return {
      title: `${objective} - ${year} Roadmap`,
      summary: `A deadline-led plan for ${timeline.toLowerCase()}, balancing college coursework, ${objective.toLowerCase()}, and ${hours.toLowerCase()} of weekly practice.`,
      phases: [
        {
          phaseName: 'Baseline and Semester Alignment',
          duration: 'Weeks 1-2',
          targetDate: 'End of week 2',
          topics: ['Assess strong and weak subjects', 'Map college coursework to placement or exam priorities'],
          projects: ['Publish a 12-week milestone dashboard with weekly targets'],
        },
        {
          phaseName: 'Target-Track Skill Sprint',
          duration: 'Weeks 3-5',
          targetDate: 'End of week 5',
          topics: track,
          projects: [`Build one measurable ${objective.includes('Software') ? 'coding/DSA' : objective.includes('Data Science') ? 'ML' : objective.includes('Core Engineering') ? 'core engineering' : 'product'} portfolio deliverable`],
        },
        {
          phaseName: 'Internship or Placement Readiness',
          duration: 'Weeks 6-8',
          targetDate: 'End of week 8',
          topics: ['Resume and GitHub/portfolio review', 'Mock interviews, aptitude, and behavior answers'],
          projects: ['Complete two timed mock rounds and produce a refined resume and project case study'],
        },
        {
          phaseName: 'Milestone Execution',
          duration: 'Remaining timeline',
          targetDate: timeline,
          topics: ['Weekly spaced repetition', 'Application, interview, or exam performance tracking'],
          projects: ['Ship the capstone deliverable and execute the milestone action plan'],
        },
      ],
    };
  }

  const stage = answers.ventureStage || 'Project builder';
  const bottleneck = answers.biggestBottleneck || 'Product development';
  const horizon = answers.launchHorizon || 'Upcoming release';
  const hours = answers.builderHoursPerWeek || 'Flexible building commitment';
  const bottleneckTopics = bottleneck.includes('Tech')
    ? ['MVP architecture and technical feasibility', 'Rapid prototyping and release automation']
    : bottleneck.includes('UI/UX')
      ? ['User interviews and problem validation', 'Wireframes, usability tests, and conversion feedback']
      : bottleneck.includes('Business')
        ? ['Value proposition and revenue model', 'Pitch narrative, GTM, and customer acquisition']
        : ['Founder roles and hiring priorities', 'Incubation, funding, and investor outreach'];
  const deliverables = bottleneck.includes('Tech')
    ? 'functional MVP demo'
    : bottleneck.includes('UI/UX')
      ? 'validated prototype'
      : bottleneck.includes('Business')
        ? 'pitch deck and GTM experiment'
        : 'team charter and funding brief';

  return {
    title: `${stage} - Venture Delivery Roadmap`,
    summary: `A build plan for ${horizon.toLowerCase()}, removing the biggest bottleneck (${bottleneck.toLowerCase()}) with ${hours.toLowerCase()} of execution time.`,
    phases: [
      {
        phaseName: 'Problem and Scope Lock',
        duration: 'Week 1',
        targetDate: 'End of week 1',
        topics: ['Customer problem and evidence', 'Single-user, success metric, and scope definition'],
        projects: ['Ship a one-page problem brief and prioritized MVP backlog'],
      },
      {
        phaseName: 'Bottleneck Breakthrough',
        duration: 'Weeks 2-3',
        targetDate: 'End of week 3',
        topics: bottleneckTopics,
        projects: [`Complete the first ${deliverables}`],
      },
      {
        phaseName: 'User Validation and Iteration',
        duration: 'Weeks 4-6',
        targetDate: 'End of week 6',
        topics: ['User testing and feedback synthesis', 'Iteration cadence and success metrics'],
        projects: ['Run 5-10 validation sessions and publish an evidence-led iteration report'],
      },
      {
        phaseName: 'Release or Pitch',
        duration: horizon,
        targetDate: horizon,
        topics: ['Final quality, analytics, and launch readiness', 'Demo, pitch, or launch communication'],
        projects: [`Ship the major release or pitch using the ${deliverables}`],
      },
    ],
  };
}

async function generateRoadmapWithGemini(portalType, answers) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      roadmap: generateDeterministicFallback(portalType, answers),
      generationSource: 'deterministic-fallback',
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const portalInstructions = portalType === 'dreamer'
    ? 'This is a pre-engineering/dreamer student. Focus on current academic stage, JEE/CET or entrance preparation, B.Tech branch discovery, future career scope, and beginner coding/hardware projects.'
    : portalType === 'achiever'
      ? 'This is a current undergraduate engineering achiever. Focus on the engineering year, semester coursework, DSA/software or AI or core/GATE or product tracks, placement or internship preparation, and realistic weekly practice.'
      : 'This is a student startup founder or independent builder. Focus on venture stage, the specific bottleneck, MVP/prototype validation, release or pitch horizon, UI/UX, GTM/pitching, team/funding, and measurable product milestones.';

  const prompt = `You are an expert learning-path designer.
Return ONLY valid JSON with exactly this structure:
{"title":"Roadmap Title","summary":"Short summary","phases":[{"phaseName":"Phase Name","duration":"Duration","targetDate":"Milestone target date","topics":["Topic 1","Topic 2"],"projects":["Project 1"]}]}
Portal type: ${portalType}
Student choices: ${JSON.stringify(answers, null, 2)}
Persona instructions: ${portalInstructions}
Create 3 to 5 achievable, sequential phases with at least two topics and one project per phase. Every topic and project deliverable must directly reflect the selected answers and portal persona.`;

  const primaryModel = PRIMARY_MODEL;
  const modelsToTry = [primaryModel];
  const fallbackModel = await getVerifiedFallbackModel(ai);
  if (fallbackModel && fallbackModel !== primaryModel) {
    modelsToTry.push(fallbackModel);
  }

  let lastError;
  for (const modelName of modelsToTry) {
    try {
      const response = await retryGeminiModel(ai, modelName, prompt);
      const responseText = response?.text;
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
      return { roadmap, generationSource: 'gemini' };
    } catch (error) {
      lastError = error;
      const statusCode = getStatusCode(error);
      if (statusCode !== 429 && statusCode !== 503) throw error;
    }
  }

  return {
    roadmap: generateDeterministicFallback(portalType, answers),
    generationSource: 'deterministic-fallback',
  };
}

module.exports = {
  generateRoadmapWithGemini,
  generateDeterministicFallback,
  retryGeminiModel,
  getStatusCode,
  getRetryAfterSeconds,
};
