import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'ventureStage', eyebrow: '01 / Venture stage', title: 'What stage is your startup idea or independent project currently in?', description: 'This defines the right order of discovery, building, and launch work.', options: ['Raw Idea / Problem Discovery', 'Building MVP / Prototype', 'Live Product with Early Users', 'Hackathon / Patent / Research Build'] },
  { id: 'biggestBottleneck', eyebrow: '02 / Biggest bottleneck', title: 'What is your biggest roadblock at this stage?', description: 'We will make the bottleneck the focus of your earliest milestones.', options: ['Tech Architecture & MVP Development', 'UI/UX Design & User Validation', 'Business Model, Pitching & Go-To-Market', 'Team Building & Funding / Incubation'] },
  { id: 'launchHorizon', eyebrow: '03 / Launch horizon', title: 'When do you aim to ship your next major release or pitch?', description: 'The deadline creates a practical sprint or venture delivery plan.', options: ['In 2–4 weeks (Hackathon / Sprint)', 'In 1–2 months (MVP Launch)', 'In 3–6 months (Incubation / Seed Pitch)', 'Ongoing Long-Term Venture'] },
  { id: 'builderHoursPerWeek', eyebrow: '04 / Builder commitment', title: 'How many hours per week can you dedicate to building?', description: 'We will set a realistic build, validation, and pitch cadence.', options: ['4–6 hours', '7–12 hours', '13–20 hours', '20+ hours (All-in)'] },
];

export default function InnovatorQuiz() {
  return <PortalQuiz portalType="innovator" eyebrow="Innovator launch planner" title="Build something worth sharing." description="Turn an idea into a focused project and hackathon roadmap." questions={questions} />;
}
