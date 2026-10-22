import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'targetRole', eyebrow: '01 / Direction', title: 'What do you want to build?', description: 'Choose the role that feels most exciting right now.', options: ['Frontend Engineer', 'Backend Engineer', 'Data Scientist', 'Product Designer'] },
  { id: 'currentSkillLevel', eyebrow: '02 / Experience', title: 'Where are you on your journey?', description: 'We will tune the roadmap to your current experience.', options: ['Just getting started', 'Comfortable with the basics', 'Building real projects', 'Ready for advanced work'] },
  { id: 'preferredLanguage', eyebrow: '03 / Toolkit', title: 'Which language do you prefer?', description: 'Your preference shapes the examples and project ideas.', options: ['JavaScript', 'Python', 'Java', 'I am open to suggestions'] },
  { id: 'timeCommitmentHours', eyebrow: '04 / Momentum', title: 'How much time can you commit weekly?', description: 'A realistic pace makes a roadmap easier to follow.', options: ['2–4 hours', '5–8 hours', '9–12 hours', '12+ hours'] },
];

export default function DreamerQuiz() {
  return <PortalQuiz portalType="dreamer" eyebrow="Dreamer path finder" title="Find your next direction." description="Explore a stream and skill roadmap aligned with your goals." questions={questions} />;
}
