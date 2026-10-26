import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'targetExam', eyebrow: '01 / Target', title: 'What exam or skill target are you preparing for?', description: 'Name the target so milestones can be tailored to the assessment.', options: ['University exams', 'Placement assessments', 'Competitive exams', 'A professional certification'] },
  { id: 'targetDate', eyebrow: '02 / Deadline', title: 'When is your target date?', description: 'We will work backward from this deadline for a review schedule.', options: ['Within 1 month', 'In 1–3 months', 'In 3–6 months', 'More than 6 months away'] },
  { id: 'hoursPerWeek', eyebrow: '03 / Capacity', title: 'How many hours can you study weekly?', description: 'Your available time sets the review cadence.', options: ['2–4 hours', '5–8 hours', '9–12 hours', '12+ hours'] },
  { id: 'weakAreas', eyebrow: '04 / Focus', title: 'Which areas need the most review?', description: 'Prioritizing weak areas makes each milestone more effective.', options: ['Programming and DSA', 'Mathematics and theory', 'Systems and databases', 'Communication and aptitude'] },
];

export default function AchieverQuiz() {
  return <PortalQuiz portalType="achiever" eyebrow="Achiever academic planner" title="Turn effort into progress." description="Build a focused semester and academic roadmap around your next target." questions={questions} />;
}
