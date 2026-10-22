import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'domainInterest', eyebrow: '01 / Domain', title: 'What do you want to explore?', description: 'Your domain interest will shape the project ideas and learning stack.', options: ['Artificial intelligence', 'Web3 and blockchain', 'Cloud and DevOps', 'Robotics and IoT'] },
  { id: 'techStackProficiency', eyebrow: '02 / Stack', title: 'How comfortable are you with your stack?', description: 'This helps us balance learning new tools with building quickly.', options: ['Beginner', 'Comfortable with one stack', 'Full-stack builder', 'Advanced and specialized'] },
  { id: 'projectIdeaScope', eyebrow: '03 / Scope', title: 'What kind of project do you want to ship?', description: 'Start with a scope you can validate and demonstrate.', options: ['A focused weekend prototype', 'A polished portfolio project', 'A team-based MVP', 'A scalable product concept'] },
  { id: 'hackathonTimeline', eyebrow: '04 / Timeline', title: 'When is your next hackathon or launch?', description: 'We will work backward from your deadline to define milestones.', options: ['This weekend', 'Within one month', 'Within three months', 'No deadline yet'] },
];

export default function InnovatorQuiz() {
  return <PortalQuiz portalType="innovator" eyebrow="Innovator launch planner" title="Build something worth sharing." description="Turn an idea into a focused project and hackathon roadmap." questions={questions} />;
}
