import { Link } from 'react-router-dom';

export default function AchieverDashboard() {
  return (
    <main className="portal-page">
      <div className="portal-header">
        <h1>Achiever Dashboard</h1>
        <p>Track your learning plan and continue building job-ready skills.</p>
      </div>
      <div className="dashboard-actions">
        <Link className="portal-card action-card" to="/roadmap"><h3>View my roadmaps</h3><p>Review your saved learning plans and milestones.</p></Link>
        <Link className="portal-card action-card" to="/dreamer-quiz"><h3>Create a new roadmap</h3><p>Update your goals and generate a fresh plan.</p></Link>
      </div>
    </main>
  );
}
