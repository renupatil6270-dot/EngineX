import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'academicStage', eyebrow: '01 / Academic stage', title: 'Which stage of pre-engineering are you currently in?', description: 'This anchors the roadmap to your current school or entrance-preparation phase.', options: ['Class 11 (Early Foundation)', 'Class 12 (Board + Entrance Prep)', 'Drop Year / Competitive Exam Prep', 'Class 9–10 (Early Tech Explorer)'] },
  { id: 'favoriteSubject', eyebrow: '02 / Thinking style', title: 'Which subject or activity excites you the most?', description: 'Your strongest interest helps identify suitable engineering branches.', options: ['Mathematics & Logic Puzzles', 'Physics, Mechanics & Electronics', 'Coding, Computers & AI', 'Chemistry, Biotech & Sustainability'] },
  { id: 'primaryGoal', eyebrow: '03 / Primary goal', title: 'What is your main goal over the next 6–12 months?', description: 'We will prioritize the milestone that matters most right now.', options: ['Crack JEE / CET / Engineering Entrance', 'Choose the right B.Tech branch', 'Build my first beginner coding/hardware project', 'Explore future tech careers & scope'] },
  { id: 'hoursPerWeek', eyebrow: '04 / Momentum', title: 'How many hours can you commit weekly?', description: 'A realistic pace makes a beginner-friendly roadmap sustainable.', options: ['2–4 hours', '5–8 hours', '9–12 hours', '12+ hours'] },
];

export default function DreamerQuiz() {
  return <PortalQuiz portalType="dreamer" eyebrow="Dreamer path finder" title="Find your next direction." description="Explore a stream and skill roadmap aligned with your goals." questions={questions} />;
}
