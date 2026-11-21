import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

function MetricCard({ label, value, accent = 'text-teal-300' }) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/roadmaps/profile')
      .then((response) => setProfile(response.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load your roadmap.');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCheckpoint = async (checkpointId, completed) => {
    if (!profile?.roadmap?.id) return;
    setSavingId(checkpointId);
    setError('');
    try {
      const response = await API.patch(
        `/roadmaps/${profile.roadmap.id}/topics/${checkpointId}`,
        { completed }
      );
      setProfile((current) => ({
        ...current,
        progress: {
          ...current.progress,
          completedTopicIds: response.data.progress?.completedTopicIds || [],
          progressPercentage: response.data.progress?.completionPercentage || 0,
          completedCount: response.data.progress?.completedTopics || 0,
          totalTopics: response.data.progress?.totalTopics || 0,
          weeklyTarget: response.data.progress?.weeklyTarget || 0,
          learningSpeed: response.data.progress?.learningSpeed || 0,
        },
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update progress.');
    } finally {
      setSavingId('');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
        <p className="text-sm text-slate-400">Loading active roadmap...</p>
      </main>
    );
  }

  if (!profile?.roadmap?.aiResponse) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-3xl items-center px-4 py-16">
        <section className="glass-card w-full rounded-3xl p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">Execution Workspace</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-100">No active roadmap yet</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-400">
            Take a portal quiz to generate the milestones and daily checkpoints for your dashboard.
          </p>
          <Link to="/portals" className="primary-button mt-8 inline-flex px-5 py-3 text-sm">Choose a Portal</Link>
        </section>
      </main>
    );
  }

  const roadmap = profile.roadmap.aiResponse;
  const progress = profile.progress || {};
  const completedIds = progress.completedTopicIds || [];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-10 text-slate-100 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">Active Execution</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{roadmap.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{roadmap.summary}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/profile" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-teal-300/50">
            View Quiz Summary
          </Link>
          <Link to="/portals" className="primary-button px-4 py-2 text-sm">Switch Portal</Link>
        </div>
      </div>

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Progress" value={`${progress.progressPercentage || 0}%`} />
        <MetricCard label="Completed" value={`${progress.completedCount || 0}/${progress.totalTopics || 0}`} accent="text-blue-300" />
        <MetricCard label="This Week's Target" value={`${progress.weeklyTarget || 0} topics`} />
        <MetricCard label="Learning Speed" value={`${progress.learningSpeed || 0} / week`} accent="text-blue-300" />
      </section>

      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <div className="mt-7 flex flex-wrap items-center gap-2">
        {['All', 'Pending', 'Completed'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${filter === option ? 'border-teal-300 bg-teal-300 text-slate-950' : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:text-slate-100'}`}
          >
            {option}
          </button>
        ))}
      </div>

      <section className="mt-5 space-y-5">
        {(roadmap.phases || []).map((phase, phaseIndex) => (
          <article key={`${phase.phaseName}-${phaseIndex}`} className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-teal-300">Milestone {phaseIndex + 1}</p>
                <h2 className="mt-1 text-xl font-bold">{phase.phaseName}</h2>
              </div>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {phase.duration} · {phase.targetDate}
              </span>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {[
                ['Topics', phase.topics || [], 'topic'],
                ['Projects', phase.projects || [], 'project'],
              ].map(([label, items, kind]) => (
                <div key={label}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <ul className="mt-3 space-y-2">
                    {items.map((item, itemIndex) => {
                      const checkpointId = `phase-${phaseIndex}-${kind}-${itemIndex}`;
                      const completed = completedIds.includes(checkpointId);
                      if (
                        (filter === 'Pending' && completed) ||
                        (filter === 'Completed' && !completed)
                      ) return null;
                      return (
                        <li key={checkpointId}>
                          <button
                            type="button"
                            disabled={savingId === checkpointId}
                            aria-pressed={completed}
                            onClick={() => toggleCheckpoint(checkpointId, !completed)}
                            className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                              completed
                                ? 'border-teal-300/30 bg-teal-300/10 text-slate-500 line-through'
                                : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              completed ? 'border-teal-300 bg-teal-300 text-slate-950' : 'border-slate-600'
                            }`}>
                              {completed ? '✓' : kind === 'project' ? '◆' : ''}
                            </span>
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
