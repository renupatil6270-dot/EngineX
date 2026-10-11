import { useEffect, useState } from 'react';
import API from '../utils/api';

function RoadmapCard({ roadmap }) {
  const data = roadmap.data;
  return (
    <article className="roadmap-card">
      <h2>{data.title}</h2>
      <p>{data.summary}</p>
      <h3>Skill gaps</h3>
      <ul>{data.skillGaps.map((gap) => <li key={gap.skill}><strong>{gap.skill}</strong> — {gap.priority}</li>)}</ul>
      <h3>Phases</h3>
      <div className="phase-list">{data.phases.map((phase) => <section key={`${roadmap._id}-${phase.month}`}><strong>Month {phase.month}: {phase.title}</strong><p>{phase.deliverable}</p></section>)}</div>
      <h3>Projects</h3>
      <ul>{data.projects.map((project) => <li key={project.title}>{project.title} ({project.difficulty})</li>)}</ul>
    </article>
  );
}

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/roadmap')
      .then((response) => setRoadmaps(response.data.roadmaps))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load roadmaps'));
  }, []);

  return (
    <main className="roadmap-page">
      <div className="portal-header"><h1>My Roadmaps</h1><p>Your saved EngineX learning plans.</p></div>
      {error && <div className="error-msg">{error}</div>}
      {!error && roadmaps.length === 0 && <div className="page-message">No roadmaps yet. Complete the Dreamer Quiz to create one.</div>}
      {roadmaps.map((roadmap) => <RoadmapCard key={roadmap._id} roadmap={roadmap} />)}
    </main>
  );
}
