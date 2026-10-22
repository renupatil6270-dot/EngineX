import type { Portal, QuizAnswer } from '../App'

interface Props {
  portal: Portal
  answers: QuizAnswer[]
  onViewRoadmap: () => void
  onRestart: () => void
}

interface CategoryStat {
  category: string
  correct: number
  total: number
  score: number
}

const theme = {
  dreamer: { from: '#7C3AED', to: '#EC4899', accent: '#A855F7', dim: 'rgba(124,58,237,0.2)' },
  pursuer: { from: '#14B8A6', to: '#3B82F6', accent: '#2DD4BF', dim: 'rgba(20,184,166,0.2)' },
}

function getLabel(score: number) {
  if (score >= 80) return { label: 'Strong', color: '#22C55E' }
  if (score >= 50) return { label: 'Growing', color: '#F59E0B' }
  return { label: 'Gap Area', color: '#EF4444' }
}

export default function Results({ portal, answers, onViewRoadmap, onRestart }: Props) {
  const t = theme[portal]
  const total = answers.length
  const totalCorrect = answers.filter(a => a.correct).length
  const overallScore = Math.round((totalCorrect / total) * 100)

  const categories = answers.reduce<Record<string, { correct: number; total: number }>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = { correct: 0, total: 0 }
    acc[a.category].total++
    if (a.correct) acc[a.category].correct++
    return acc
  }, {})

  const stats: CategoryStat[] = Object.entries(categories).map(([cat, s]) => ({
    category: cat,
    correct: s.correct,
    total: s.total,
    score: Math.round((s.correct / s.total) * 100),
  })).sort((a, b) => a.score - b.score)

  const gapAreas = stats.filter(s => s.score < 50)
  const strongAreas = stats.filter(s => s.score >= 80)

  const greetingMap = {
    dreamer: overallScore >= 70
      ? "You're already building momentum."
      : overallScore >= 40
      ? "Your foundation is there — the gaps are clear."
      : "Big dreams need strong foundations. Let's build.",
    pursuer: overallScore >= 70
      ? "Solid baseline. Optimization mode engaged."
      : overallScore >= 40
      ? "Diagnostic complete. Clear gaps identified."
      : "Baseline established. Full roadmap incoming.",
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-15"
          style={{ background: t.from }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-10"
          style={{ background: t.to }} />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Score hero */}
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-4">Assessment Complete</p>
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#CBD5E1" strokeWidth="8" />
              <circle
                cx="80" cy="80" r="68" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - overallScore / 100)}`}
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={t.from} />
                  <stop offset="100%" stopColor={t.to} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>{overallScore}%</span>
              <span className="text-slate-500 text-xs font-mono">{totalCorrect}/{total} correct</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            {greetingMap[portal]}
          </h1>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s', background: 'rgba(255,255,255,0.68)', border: '1px solid rgba(148,163,184,0.24)' }}>
          <h2 className="text-slate-700 text-xs font-mono tracking-widest uppercase mb-5">Skill Breakdown</h2>
          <div className="space-y-4">
            {stats.map(stat => {
              const { label, color } = getLabel(stat.score)
              return (
                <div key={stat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-700 text-sm">{stat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}>
                        {label}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">{stat.correct}/{stat.total}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${stat.score}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gap areas */}
        {gapAreas.length > 0 && (
          <div className="rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h2 className="text-red-700 text-xs font-mono tracking-widest uppercase mb-3">
              ⚠ Grey Areas · {gapAreas.length} found
            </h2>
            <div className="flex flex-wrap gap-2">
              {gapAreas.map(g => (
                <span key={g.category} className="text-sm px-3 py-1 rounded-lg text-slate-700"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  {g.category} · {g.score}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strong areas */}
        {strongAreas.length > 0 && (
          <div className="rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.25s', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h2 className="text-green-700 text-xs font-mono tracking-widest uppercase mb-3">
              ✓ Strengths · {strongAreas.length} areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {strongAreas.map(g => (
                <span key={g.category} className="text-sm px-3 py-1 rounded-lg text-slate-700"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  {g.category} · {g.score}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onViewRoadmap}
            className="flex-1 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
              boxShadow: `0 14px 32px ${t.dim}`,
            }}
          >
            View My Roadmap →
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-4 rounded-xl font-medium text-slate-500 transition-all duration-200 hover:text-slate-700"
            style={{ background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.24)' }}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}
