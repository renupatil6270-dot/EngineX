import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

function titleCase(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const questionLabels = {
  dreamer: [
    ['academicStage', 'Current Academic Stage'],
    ['favoriteSubject', 'Favorite Subject & Thinking Style'],
    ['primaryGoal', 'Primary Pre-Engineering Goal'],
    ['hoursPerWeek', 'Weekly Self-Study Commitment'],
  ],
  achiever: [
    ['engineeringYear', 'Current Engineering Year'],
    ['careerObjective', 'Primary Career Objective'],
    ['milestoneTimeline', 'Target Timeline'],
    ['hoursPerWeek', 'Weekly Practice Bandwidth'],
  ],
  innovator: [
    ['ventureStage', 'Current Venture / Project Stage'],
    ['biggestBottleneck', 'Biggest Bottleneck Right Now'],
    ['launchHorizon', 'Target Launch / Demo Horizon'],
    ['builderHoursPerWeek', 'Weekly Builder Commitment'],
  ],
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/roadmaps/profile')
      .then((response) => setProfile(response.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load your profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
        <p className="text-sm text-slate-400">Loading your profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-5xl px-4 py-16 text-slate-100">
        {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
      </main>
    );
  }

  const quiz = profile.quiz;
  const answers = quiz?.answers || {};
  const progress = profile.progress || {};
  const labels = questionLabels[quiz?.portalType] || [];

  if (!quiz) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-3xl items-center px-4 py-16">
        <section className="glass-card w-full rounded-3xl p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">Your Profile</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-100">Start your learning journey</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">
            Complete a portal quiz to save your goals and create an active roadmap.
          </p>
          <Link to="/portals" className="primary-button mt-8 inline-flex px-5 py-3 text-sm">Choose a Portal</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-10 text-slate-100 sm:px-8 sm:py-14">
      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="glass-card rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">User Identity</p>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-blue-500 text-2xl font-black text-slate-950">
              {profile.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
            <div>
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <p className="mt-1 text-sm text-slate-400">{profile.user.email}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-bold text-teal-200">
              {titleCase(quiz.portalType)} Portal
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
              Account: Active
            </span>
          </div>
        </article>

        <article className="glass-card rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Overall Progress Snapshot</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-xs text-slate-500">Completion</p>
              <p className="mt-2 text-3xl font-bold text-teal-300">{progress.progressPercentage || 0}%</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-xs text-slate-500">Topics Completed</p>
              <p className="mt-2 text-3xl font-bold text-blue-300">{progress.completedCount || 0}/{progress.totalTopics || 0}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/dashboard" className="primary-button px-5 py-2.5 text-sm">Go to Dashboard</Link>
            <Link to="/portals" className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-teal-300/50">
              Retake / Switch Quiz
            </Link>
          </div>
        </article>
      </section>

      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <section className="glass-card mt-5 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Saved Quiz Responses</p>
            <h2 className="mt-2 text-xl font-bold">Latest {titleCase(quiz.portalType)} assessment</h2>
          </div>
          {quiz.submittedAt && (
            <span className="text-xs text-slate-500">
              Submitted {new Date(quiz.submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {labels.map(([key, label]) => (
            <div key={key} className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">{answers[key] || 'Not set'}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
