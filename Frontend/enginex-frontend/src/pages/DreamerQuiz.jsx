import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

function splitItems(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function DreamerQuiz() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAnswers((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await API.post('/quiz/submit', {
        portalType: 'dreamer',
        answers: {
          ...answers,
          targetRoles: splitItems(answers.targetRoles),
          desiredSkills: splitItems(answers.desiredSkills),
          acquiredSkills: splitItems(answers.acquiredSkills),
          timelineMonths: Number(answers.timelineMonths),
        },
      });
      navigate('/roadmap');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate your roadmap');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Dreamer Quiz</h1>
        <p className="form-intro">Tell us where you want to go so EngineX can create a practical learning roadmap.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit} className="quiz-form">
          <label>Interested domain<input name="interestedDomain" value={answers.interestedDomain} onChange={handleChange} required placeholder="Computer Science" /></label>
          <label>Specialization<input name="specialization" value={answers.specialization} onChange={handleChange} placeholder="Artificial Intelligence" /></label>
          <label>Target roles <span className="hint">(comma separated)</span><input name="targetRoles" value={answers.targetRoles} onChange={handleChange} placeholder="ML Engineer, Data Scientist" /></label>
          <label>Desired skills <span className="hint">(comma separated)</span><input name="desiredSkills" value={answers.desiredSkills} onChange={handleChange} placeholder="Python, Machine Learning" /></label>
          <label>Acquired skills <span className="hint">(comma separated)</span><input name="acquiredSkills" value={answers.acquiredSkills} onChange={handleChange} placeholder="JavaScript, HTML" /></label>
          <label>Primary goal<textarea name="primaryGoal" value={answers.primaryGoal} onChange={handleChange} placeholder="Get an internship" rows="3" /></label>
          <label>Timeline: {answers.timelineMonths} months<input type="range" name="timelineMonths" min="1" max="60" value={answers.timelineMonths} onChange={handleChange} /></label>
          <button type="submit" className="auth-btn" disabled={submitting}>{submitting ? 'Generating roadmap...' : 'Generate roadmap'}</button>
        </form>
        <Link to="/portals" className="back-link">Back to portals</Link>
      </div>
    </main>
  );
}
