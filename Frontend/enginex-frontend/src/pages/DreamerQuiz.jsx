import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const initialAnswers = {
  interestedDomain: '',
  specialization: '',
  targetRoles: '',
  desiredSkills: '',
  acquiredSkills: '',
  primaryGoal: '',
  timelineMonths: 6,
};

const splitItems = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function DreamerQuiz() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (event) => setAnswers((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await API.post('/quiz/submit', {
        portalType: 'dreamer',
        answers: {
          ...answers,
          targetRoles: splitItems(answers.targetRoles),
          desiredSkills: splitItems(answers.desiredSkills),
          acquiredSkills: splitItems(answers.acquiredSkills),
          timelineMonths: Number(answers.timelineMonths),
        },
      });
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate your roadmap.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Dreamer Quiz</h2>
        <p className="auth-subtitle">Tell us where you want your engineering journey to go.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          <div className="form-group"><label>Interested domain</label><input name="interestedDomain" value={answers.interestedDomain} onChange={update} required placeholder="Computer Science" /></div>
          <div className="form-group"><label>Specialization</label><input name="specialization" value={answers.specialization} onChange={update} placeholder="Artificial Intelligence" /></div>
          <div className="form-group"><label>Target roles (comma separated)</label><input name="targetRoles" value={answers.targetRoles} onChange={update} placeholder="ML Engineer, Data Scientist" /></div>
          <div className="form-group"><label>Desired skills (comma separated)</label><input name="desiredSkills" value={answers.desiredSkills} onChange={update} placeholder="Python, Machine Learning" /></div>
          <div className="form-group"><label>Skills you already have (comma separated)</label><input name="acquiredSkills" value={answers.acquiredSkills} onChange={update} placeholder="JavaScript" /></div>
          <div className="form-group"><label>Primary goal</label><textarea name="primaryGoal" value={answers.primaryGoal} onChange={update} placeholder="Get an internship" /></div>
          <div className="form-group"><label>Timeline (months)</label><input name="timelineMonths" type="number" min="1" max="60" value={answers.timelineMonths} onChange={update} required /></div>
          <button type="submit" className="auth-btn" disabled={submitting}>{submitting ? 'Generating...' : 'Generate roadmap'}</button>
        </form>
        {roadmap && (
          <section className="roadmap-result">
            <h2>{roadmap.title}</h2>
            <p>{roadmap.summary}</p>
            <h3>Skill gaps</h3>
            <ul>{roadmap.skillGaps.map((gap) => <li key={gap.skill}>{gap.skill} ({gap.priority})</li>)}</ul>
            <h3>Plan</h3>
            {roadmap.phases.map((phase) => <div key={phase.month}><strong>Month {phase.month}: {phase.title}</strong><p>{phase.deliverable}</p></div>)}
          </section>
        )}
        <p className="auth-footer"><Link to="/portals">← Back to Portals</Link></p>
      </div>
    </div>
  );
}
