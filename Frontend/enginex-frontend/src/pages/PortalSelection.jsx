import { useState } from 'react'
import EngineXLogo from './EngineXLogo'



export default function PortalSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-700/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-500/15 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* Logo */}
      <div className="mb-14 text-center animate-slide-up">
        <div className="flex justify-center mb-3">
          <EngineXLogo size={52} showText={true} />
        </div>
        <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">Bridging academic theory &amp; industry reality</p>
      </div>

      {/* Headline */}
      <div className="text-center mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: 'Fraunces, serif' }}>
          Who are you<br />
          <span className="shimmer-text">building for?</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Choose your portal. We'll assess your skills, expose the gaps, and hand you a personalized roadmap.
        </p>
      </div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Dreamer */}
        <button
          onMouseEnter={() => setHovered('dreamer')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect('dreamer')}
          className="group relative rounded-2xl border border-violet-500/30 p-8 text-left transition-all duration-500 overflow-hidden"
          style={{
            background: hovered === 'dreamer'
              ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15))'
              : 'rgba(255,255,255,0.68)',
            boxShadow: hovered === 'dreamer' ? '0 20px 50px rgba(124,58,237,0.14)' : '0 12px 36px rgba(15,23,42,0.06)',
            borderColor: hovered === 'dreamer' ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.25)',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.15), transparent 70%)' }}
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(236,72,153,0.4))', border: '1px solid rgba(124,58,237,0.5)' }}>
              🚀
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
              Dreamer
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              You have a vision. You're chasing something big — a product, a career leap, a future you can see but haven't built yet. Let's find out what's standing between you and it.
            </p>
            <div className="flex items-center gap-2 text-violet-700 text-sm font-semibold">
              <span>Enter Dreamer Portal</span>
              <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />
        </button>

        {/* Pursuer */}
        <button
          onMouseEnter={() => setHovered('pursuer')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelect('pursuer')}
          className="group relative rounded-2xl border border-teal-500/30 p-8 text-left transition-all duration-500 overflow-hidden"
          style={{
            background: hovered === 'pursuer'
              ? 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(59,130,246,0.15))'
              : 'rgba(255,255,255,0.68)',
            boxShadow: hovered === 'pursuer' ? '0 20px 50px rgba(20,184,166,0.14)' : '0 12px 36px rgba(15,23,42,0.06)',
            borderColor: hovered === 'pursuer' ? 'rgba(20,184,166,0.6)' : 'rgba(20,184,166,0.25)',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(20,184,166,0.15), transparent 70%)' }}
          />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.4), rgba(59,130,246,0.4))', border: '1px solid rgba(20,184,166,0.5)' }}>
              🎯
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
              Pursuer
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              You're structured. You want data, a clear diagnosis, and a precise action plan. Tell us what you know, and we'll tell you exactly what to learn next.
            </p>
            <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold">
              <span>Enter Pursuer Portal</span>
              <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent)' }} />
        </button>
      </div>

      <p className="mt-10 text-slate-400 text-xs font-mono" style={{ animationDelay: '0.3s' }}>
        Takes ~5 minutes · 15 questions · Instant results
      </p>
    </div>
  )
}
