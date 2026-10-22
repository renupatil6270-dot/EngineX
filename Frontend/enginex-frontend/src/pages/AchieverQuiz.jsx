import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'currentSemester', eyebrow: '01 / Semester', title: 'What is your current semester or year?', description: 'We will align your plan to the time you have left this academic year.', options: ['First year / Semester 1–2', 'Second year / Semester 3–4', 'Third year / Semester 5–6', 'Final year / Semester 7–8'] },
  { id: 'weakSubjectAreas', eyebrow: '02 / Focus', title: 'Which subject areas need the most attention?', description: 'Be honest so the roadmap can prioritize the right foundations.', options: ['Programming and DSA', 'Mathematics and theory', 'Systems and databases', 'Communication and aptitude'] },
  { id: 'examTargetGoals', eyebrow: '03 / Goals', title: 'What is your next academic target?', description: 'Your target determines the intensity and milestones of your study plan.', options: ['Pass all subjects confidently', 'Score above 8 CGPA', 'Prepare for placements', 'Prepare for competitive exams'] },
  { id: 'prepStrategyPreference', eyebrow: '04 / Strategy', title: 'How do you prefer to prepare?', description: 'Choose the study rhythm you are most likely to sustain.', options: ['Daily short sessions', 'Weekend deep work', 'Practice tests first', 'Guided notes and revision'] },
];

export default function AchieverQuiz() {
  return <PortalQuiz portalType="achiever" eyebrow="Achiever academic planner" title="Turn effort into progress." description="Build a focused semester and academic roadmap around your next target." questions={questions} />;
}
