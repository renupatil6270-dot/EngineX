import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'projectType', eyebrow: '01 / Project', title: 'What kind of project do you want to ship?', description: 'The project type shapes the architecture and build phases.', options: ['Web application', 'Mobile application', 'AI or data product', 'Developer tool or API'] },
  { id: 'techStack', eyebrow: '02 / Stack', title: 'Which technology stack will you use?', description: 'The roadmap will use this stack for implementation examples.', options: ['MERN', 'Python and FastAPI', 'Java and Spring', 'I need stack guidance'] },
  { id: 'teamSize', eyebrow: '03 / Team', title: 'How large is your team?', description: 'Team size affects ownership, collaboration, and delivery milestones.', options: ['Solo builder', '2–3 people', '4–6 people', 'More than 6 people'] },
  { id: 'projectGoal', eyebrow: '04 / Outcome', title: 'What is the project goal?', description: 'A clear outcome helps turn the idea into an MVP and launch plan.', options: ['Validate an idea', 'Build a portfolio project', 'Launch a startup MVP', 'Win a hackathon'] },
];

export default function InnovatorQuiz() {
  return <PortalQuiz portalType="innovator" eyebrow="Innovator launch planner" title="Build something worth sharing." description="Turn an idea into a focused project and hackathon roadmap." questions={questions} />;
}
