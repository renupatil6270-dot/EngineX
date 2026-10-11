import { Link } from 'react-router-dom';

export default function InnovatorHub() {
  return (
    <main className="portal-page">
      <div className="portal-header">
        <h1>Innovator Hub</h1>
        <p>Turn your roadmap skills into practical projects and portfolio evidence.</p>
      </div>
      <div className="portal-card action-card">
        <h3>Start with a project roadmap</h3>
        <p>Use your saved roadmap to choose a focused project and document your progress.</p>
        <Link className="portal-action" to="/roadmap">Open roadmap →</Link>
      </div>
    </main>
  );
}
