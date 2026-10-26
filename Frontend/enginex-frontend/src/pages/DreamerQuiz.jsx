import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'domain', eyebrow: '01 / Domain', title: 'Which domain do you want to explore?', description: 'This gives your foundational roadmap a clear direction.', options: ['Web development', 'Data and AI', 'Cloud and DevOps', 'Product design'] },
  { id: 'careerGoal', eyebrow: '02 / Goal', title: 'What career goal are you working toward?', description: 'We will connect each skill milestone to your desired outcome.', options: ['First tech role', 'Career switch', 'Advance in my current role', 'Build a freelance career'] },
  { id: 'experience', eyebrow: '03 / Experience', title: 'Where are you starting from?', description: 'Your experience determines the pace and depth of the foundations.', options: ['Complete beginner', 'Some self-study', 'Built a few projects', 'Professional experience'] },
  { id: 'hoursPerWeek', eyebrow: '04 / Momentum', title: 'How many hours can you commit weekly?', description: 'A realistic pace makes a beginner-friendly roadmap sustainable.', options: ['2–4 hours', '5–8 hours', '9–12 hours', '12+ hours'] },
];

export default function DreamerQuiz() {
  return <PortalQuiz portalType="dreamer" eyebrow="Dreamer path finder" title="Find your next direction." description="Explore a stream and skill roadmap aligned with your goals." questions={questions} />;
}
