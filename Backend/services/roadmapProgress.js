const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

function getTopicId(phaseIndex, topicIndex) {
  return `phase-${phaseIndex}-topic-${topicIndex}`;
}

function getRoadmapTopics(roadmap) {
  return (roadmap?.phases || []).flatMap((phase, phaseIndex) =>
    (phase.topics || []).map((topic, topicIndex) => ({
      id: getTopicId(phaseIndex, topicIndex),
      label: topic,
    }))
  );
}

function calculateRoadmapProgress(
  roadmap,
  completedTopicIds = [],
  now = Date.now(),
  createdAt = roadmap?.createdAt
) {
  const topics = getRoadmapTopics(roadmap);
  const validTopicIds = new Set(topics.map((topic) => topic.id));
  const completed = [...new Set(completedTopicIds)].filter((topicId) =>
    validTopicIds.has(topicId)
  );
  const phaseCount = Math.max(roadmap?.phases?.length || 0, 1);
  const totalTopics = topics.length;
  const completedTopics = completed.length;
  const remainingTopics = Math.max(totalTopics - completedTopics, 0);
  const roadmapCreatedAt = new Date(createdAt || now).getTime();
  const elapsedWeeks = Math.max((now - roadmapCreatedAt) / WEEK_IN_MS, 1);
  const learningSpeed = completedTopics > 0 ? completedTopics / elapsedWeeks : 0;
  const baselineTarget = Math.max(1, Math.ceil(totalTopics / phaseCount));
  const weeklyTarget = completedTopics > 0
    ? Math.max(1, Math.ceil(learningSpeed))
    : baselineTarget;

  return {
    completedTopicIds: completed,
    totalTopics,
    completedTopics,
    remainingTopics,
    completionPercentage: totalTopics
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0,
    learningSpeed: Number(learningSpeed.toFixed(1)),
    weeklyTarget,
    projectedWeeksRemaining: remainingTopics
      ? Math.ceil(remainingTopics / weeklyTarget)
      : 0,
  };
}

module.exports = {
  calculateRoadmapProgress,
  getRoadmapTopics,
};
