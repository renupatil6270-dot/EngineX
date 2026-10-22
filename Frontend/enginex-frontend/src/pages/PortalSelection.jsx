// src/pages/PortalSelection.jsx
import { Link } from 'react-router-dom';

export default function PortalSelection() {
  const portals = [
    {
      id: 'dreamer',
      title: 'Dreamer Portal',
      description: 'Explore engineering streams, assess your interests, and take the stream finder quiz.',
      icon: '🚀',
      route: '/dreamer-quiz',
      badge: 'Popular',
    },
    {
      id: 'achiever',
      title: 'Achiever Portal',
      description: 'Access study resources, roadmap guides, semester trackers, and subject roadmaps.',
      icon: '🎯',
      route: '/achiever-quiz',
      badge: 'Academic',
    },
    {
      id: 'innovator',
      title: 'Innovator Portal',
      description: 'Discover hackathons, open source projects, and project collaboration opportunities.',
      icon: '💡',
      route: '/innovator-quiz',
      badge: 'Build',
    },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-300">Your workspace</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">Choose your EngineX path.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Each portal turns your goals into an actionable, AI-powered roadmap built around where you are today.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {portals.map((portal) => (
          <Link
            key={portal.id}
            to={portal.route}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30 transition-all hover:-translate-y-1 hover:border-teal-400/50 hover:bg-slate-900/90 hover:shadow-teal-950/30"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">{portal.icon}</span>
              <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200">{portal.badge}</span>
            </div>
            <h2 className="mt-8 text-xl font-bold text-slate-100">{portal.title}</h2>
            <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">{portal.description}</p>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-teal-300">
              <span>Enter portal</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
