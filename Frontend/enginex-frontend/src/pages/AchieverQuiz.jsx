import PortalQuiz from '../components/PortalQuiz';

const questions = [
  { id: 'engineeringYear', eyebrow: '01 / Engineering year', title: 'Which year of your engineering degree are you currently in?', description: 'This connects the roadmap to your coursework and current career stage.', options: ['1st Year (Foundations & Exploration)', '2nd Year (Core Subjects & Skill Building)', '3rd Year (Internships & Pre-Placement)', 'Final Year (Placements & Capstone)'] },
  { id: 'careerObjective', eyebrow: '02 / Career objective', title: 'What is your top priority right now?', description: 'The primary track determines the skills and milestones we emphasize.', options: ['Software / Full-Stack & DSA Placements', 'Data Science, AI & Machine Learning', 'Core Engineering / GATE / Higher Studies', 'Product Management & Tech Consulting'] },
  { id: 'milestoneTimeline', eyebrow: '03 / Target timeline', title: 'When is your next major milestone (internship, placement drive, or exam)?', description: 'We will structure the plan backward from your deadline.', options: ['Within 1 month', 'In 1–3 months', 'In 3–6 months', '6+ months away'] },
  { id: 'hoursPerWeek', eyebrow: '04 / Practice capacity', title: 'How many hours per week can you commit outside college lectures?', description: 'Your bandwidth sets the review, practice, and project cadence.', options: ['2–4 hours', '5–8 hours', '9–12 hours', '12+ hours'] },
];

export default function AchieverQuiz() {
  return <PortalQuiz portalType="achiever" eyebrow="Achiever academic planner" title="Turn effort into progress." description="Build a focused semester and academic roadmap around your next target." questions={questions} />;
}
