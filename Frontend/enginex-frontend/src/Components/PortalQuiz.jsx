import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

function RoadmapList({ title, items, marker, markerClass }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => <li key={item} className="flex gap-2"><span className={markerClass}>{marker}</span>{item}</li>)}
      </ul>
    </div>
  );
}

function RoadmapView({ roadmap }) {
  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <Link to="/portals" className="text-sm font-medium text-slate-400 transition-colors hover:text-teal-300">← Back to portals</Link>
      <section className="glass-card mt-6 rounded-3xl p-6 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-300">Your personalized roadmap</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">{roadmap.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">{roadmap.summary}</p>
        <div className="relative mt-10 space-y-5 before:absolute before:bottom-5 before:left-[1.15rem] before:top-5 before:w-px before:bg-gradient-to-b before:from-teal-300 before:to-blue-500">
          {roadmap.phases.map((phase, index) => (
            <article key={`${phase.phaseName}-${index}`} className="relative ml-1 pl-12">
              <span className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border-4 border-slate-950 bg-teal-300 text-xs font-black text-slate-950">{index + 1}</span>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-100">{phase.phaseName}</h2>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200">{phase.duration}</span>
                    <span className="rounded-full border border-blue-300/30 bg-blue-300/10 px-3 py-1 text-xs font-semibold text-blue-200">Target: {phase.targetDate}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <RoadmapList title="Topics" items={phase.topics} marker="•" markerClass="text-teal-300" />
                  <RoadmapList title="Projects" items={phase.projects} marker="◆" markerClass="text-blue-300" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function PortalQuiz({ portalType, eyebrow, title, description, questions }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const question = questions[step];
  const selectedAnswer = answers[question.id];

  const selectAnswer = (answer) => {
    setAnswers((current) => ({ ...current, [question.id]: answer }));
    setError('');
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/ai/generate-roadmap', { portalType, ...answers }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success || !response.data.roadmap) {
        throw new Error('The server returned an invalid roadmap response.');
      }
      setRoadmap(response.data.roadmap);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate your roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (roadmap) return <RoadmapView roadmap={roadmap} />;

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4">
        <section className="glass-card w-full max-w-md rounded-3xl p-10 text-center">
          <span className="mx-auto flex h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-teal-300" />
          <h1 className="mt-6 text-2xl font-bold text-slate-100">Designing your roadmap...</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Gemini is turning your answers into a practical next-step plan.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link to="/portals" className="text-sm font-medium text-slate-400 transition-colors hover:text-teal-300">← Back to portals</Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-teal-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-400">{step + 1} of {questions.length}</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-blue-500 transition-all duration-300" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>
      <section className="glass-card rounded-3xl p-6 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">{question.eyebrow}</p>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">{question.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{question.description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <button type="button" key={option} className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`} onClick={() => selectAnswer(option)} aria-pressed={selectedAnswer === option}>
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-200">{option}<span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${selectedAnswer === option ? 'border-teal-300 bg-teal-300 text-slate-950' : 'border-slate-600 text-transparent'}`}>✓</span></span>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-800 pt-6">
          <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-30" onClick={() => setStep((current) => current - 1)} disabled={step === 0}>Back</button>
          <button type="button" className="primary-button px-5 py-2.5 text-sm" onClick={step === questions.length - 1 ? submitQuiz : () => setStep((current) => current + 1)} disabled={!selectedAnswer}> {step === questions.length - 1 ? 'Generate roadmap' : 'Continue →'}</button>
        </div>
      </section>
    </main>
  );
}
