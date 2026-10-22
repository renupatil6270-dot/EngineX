import { useState } from 'react'
import { questions } from '../data/questions'
import type { Portal, QuizAnswer } from '../App'

interface Props {
  portal: Portal
  onComplete: (answers: QuizAnswer[]) => void
}

const primary = {
  dreamer: { from: '#7C3AED', to: '#EC4899', text: 'text-violet-700', border: 'rgba(124,58,237,0.5)', glow: 'rgba(124,58,237,0.16)' },
  pursuer: { from: '#14B8A6', to: '#3B82F6', text: 'text-teal-700', border: 'rgba(20,184,166,0.5)', glow: 'rgba(20,184,166,0.16)' },
}

export default function Quiz({ portal, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const theme = primary[portal]
  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = (idx: number) => {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
  }

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, {
      questionId: q.id,
      category: q.category,
      correct: selected === q.correct,
    }]
    if (current + 1 >= questions.length) {
      onComplete(newAnswers)
    } else {
      setAnswers(newAnswers)
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const optionStyle = (idx: number) => {
    if (!revealed) {
      return selected === idx
        ? { background: 'rgba(226,232,240,0.85)', border: `1px solid ${theme.border}` }
        : { background: 'rgba(255,255,255,0.68)', border: '1px solid rgba(148,163,184,0.24)' }
    }
    if (idx === q.correct) return { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.5)' }
    if (idx === selected) return { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)' }
    return { background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(148,163,184,0.20)' }
  }

  const difficultyColor = { beginner: '#22C55E', intermediate: '#F59E0B', advanced: '#EF4444' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] opacity-20"
          style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }} />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm font-mono">Question</span>
            <span className="text-slate-900 font-mono font-bold">{current + 1}</span>
            <span className="text-slate-500 font-mono">/ {questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{ color: difficultyColor[q.difficulty], background: `${difficultyColor[q.difficulty]}20`, border: `1px solid ${difficultyColor[q.difficulty]}40` }}>
              {q.difficulty}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full text-slate-500"
              style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(148,163,184,0.28)' }}>
              {q.category}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-slate-200/80 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl animate-slide-up">
        <div className="rounded-2xl p-8 mb-4"
          style={{ background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.24)' }}>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-relaxed mb-8"
            style={{ fontFamily: 'Fraunces, serif' }}>
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200 group"
                style={optionStyle(idx)}
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold mt-0.5"
                    style={{
                      background: revealed && idx === q.correct ? 'rgba(34,197,94,0.3)' :
                        revealed && idx === selected ? 'rgba(239,68,68,0.3)' : 'rgba(226,232,240,0.72)',
                      color: revealed && idx === q.correct ? '#22C55E' :
                        revealed && idx === selected ? '#EF4444' : 'rgba(15,23,42,0.58)',
                    }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-slate-700 text-sm leading-relaxed">{opt}</span>
                  {revealed && idx === q.correct && <span className="ml-auto text-green-700 text-sm shrink-0">✓</span>}
                  {revealed && idx === selected && idx !== q.correct && <span className="ml-auto text-red-700 text-sm shrink-0">✗</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className="mt-6 p-4 rounded-xl animate-slide-up"
              style={{ background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.24)' }}>
              <p className="text-slate-600 text-sm leading-relaxed">
                <span className="text-slate-800 font-semibold">Why: </span>
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!revealed}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: revealed ? `linear-gradient(135deg, ${theme.from}, ${theme.to})` : 'rgba(226,232,240,0.85)',
              boxShadow: revealed ? `0 0 32px ${theme.glow}` : 'none',
            }}
          >
            {current + 1 >= questions.length ? 'View Results →' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  )
}
