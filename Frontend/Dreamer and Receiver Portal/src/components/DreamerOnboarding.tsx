import { useState } from 'react'
import type { DreamerProfile } from '../App'
import EngineXLogo from './EngineXLogo'

interface Props {
  onComplete: (profile: DreamerProfile) => void
  onBack: () => void
}

const TOTAL_STEPS = 6

const domains = [
  { value: 'Technology & Software', icon: '💻', sub: 'Build apps, systems, and software' },
  { value: 'Data & Intelligence', icon: '🧠', sub: 'ML, AI, analytics, data pipelines' },
  { value: 'Design & Creative', icon: '🎨', sub: 'UI/UX, product, visual design' },
  { value: 'Business & Product', icon: '🚀', sub: 'Product management, startups, strategy' },
  { value: 'Cyber & Networks', icon: '🔐', sub: 'Security, infrastructure, networking' },
]

const specializationsByDomain: Record<string, string[]> = {
  'Technology & Software': ['AI & Machine Learning', 'Web & App Development', 'Cloud Computing', 'Game Development', 'Not sure yet (Help me choose)'],
  'Data & Intelligence': ['AI & Machine Learning', 'Data Engineering', 'Business Intelligence', 'Research & Analytics', 'Not sure yet (Help me choose)'],
  'Design & Creative': ['UI/UX & Product Design', 'Motion & Interaction Design', 'Brand & Visual Design', 'Design Systems', 'Not sure yet (Help me choose)'],
  'Business & Product': ['Product Management', 'Tech Entrepreneurship', 'Growth & Marketing', 'Operations', 'Not sure yet (Help me choose)'],
  'Cyber & Networks': ['Penetration Testing', 'Cloud Security', 'Network Engineering', 'DevSecOps', 'Not sure yet (Help me choose)'],
}

const rolesByDomain: Record<string, string[]> = {
  'Technology & Software': ['Software Developer', 'AI Enthusiast / Engineer', 'Full-Stack Engineer', 'Tech Entrepreneur', 'Exploring Options'],
  'Data & Intelligence': ['Data Analyst', 'ML Engineer', 'AI Researcher', 'Data Scientist', 'Exploring Options'],
  'Design & Creative': ['UX Designer', 'Product Designer', 'Visual Designer', 'Creative Director', 'Exploring Options'],
  'Business & Product': ['Product Manager', 'Tech Entrepreneur', 'Growth Strategist', 'Startup Founder', 'Exploring Options'],
  'Cyber & Networks': ['Security Engineer', 'Penetration Tester', 'Network Engineer', 'DevSecOps Engineer', 'Exploring Options'],
}

const skillsToAcquire = [
  'Coding / Programming', 'Data Analysis', 'System Architecture', 'UI Design',
  'Problem Solving', 'Project Management', 'Machine Learning', 'Cloud & DevOps',
  'Database Design', 'API Development', 'Security Fundamentals', 'Product Thinking',
]

const baselineSkills = [
  'None / Complete Beginner', 'Basic Logic / Math', 'HTML / CSS',
  'Python Basics', 'Design Principles', 'Excel / Spreadsheets',
  'Basic Programming Concepts', 'Git / Version Control',
]

const goals = [
  { value: 'Career switch', icon: '🔄', sub: "I'm pivoting into tech from another field" },
  { value: 'Academic / University support', icon: '🎓', sub: 'Strengthen what I learn in school' },
  { value: 'Build a startup / side project', icon: '⚡', sub: "I have an idea and I'm ready to build" },
  { value: 'Personal curiosity', icon: '🌱', sub: "I just want to learn and explore" },
]

const stepMeta = [
  { label: 'Domain', question: 'What domain are you interested in exploring?' },
  { label: 'Specialization', question: "What's your target area of focus?" },
  { label: 'Target Roles', question: 'What roles do you look forward to?' },
  { label: 'Skills to Gain', question: 'What skills do you want to acquire?' },
  { label: 'Baseline', question: 'What baseline skills do you already have?' },
  { label: 'Goal', question: 'What is your primary goal for this journey?' },
]

function MultiSelectGrid({ options, selected, onToggle }: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
            style={{
              background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.74)',
              border: `1px solid ${active ? 'rgba(124,58,237,0.6)' : 'rgba(226,232,240,0.78)'}`,
              color: active ? '#A855F7' : 'rgba(15,23,42,0.68)',
              boxShadow: active ? '0 0 12px rgba(124,58,237,0.15)' : 'none',
            }}
          >
            {active && <span className="mr-1.5">✓</span>}{opt}
          </button>
        )
      })}
    </div>
  )
}

export default function DreamerOnboarding({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<DreamerProfile>({
    domain: '',
    specializations: [],
    roles: [],
    skillsToAcquire: [],
    baselineSkills: [],
    goal: '',
  })

  const progress = ((step + 1) / TOTAL_STEPS) * 100

  const toggle = (field: keyof DreamerProfile, value: string) => {
    const arr = profile[field] as string[]
    setProfile(p => ({
      ...p,
      [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    }))
  }

  const canProceed = () => {
    if (step === 0) return profile.domain !== ''
    if (step === 1) return profile.specializations.length > 0
    if (step === 2) return profile.roles.length > 0
    if (step === 3) return profile.skillsToAcquire.length > 0
    if (step === 4) return profile.baselineSkills.length > 0
    if (step === 5) return profile.goal !== ''
    return false
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else onComplete(profile)
  }

  const specializations = specializationsByDomain[profile.domain] || [
    'AI & Machine Learning', 'Web & App Development', 'UI/UX & Product Design',
    'Cloud Computing', 'Not sure yet (Help me choose)',
  ]
  const roles = rolesByDomain[profile.domain] || [
    'Software Developer', 'AI Enthusiast / Engineer', 'UX Designer',
    'Tech Entrepreneur', 'Data Analyst', 'Exploring Options',
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Dreamer ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[400px] rounded-full blur-[150px] opacity-15" style={{ background: '#7C3AED' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-10" style={{ background: '#EC4899' }} />
      </div>

      <div className="w-full max-w-xl relative">
        {/* Nav */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={step === 0 ? onBack : () => setStep(s => s - 1)}
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-mono flex items-center gap-1"
            >
              ← {step === 0 ? 'Back to portals' : 'Previous'}
            </button>
            <EngineXLogo size={28} showText={false} />
            <span className="text-slate-400 text-xs font-mono">{step + 1} / {TOTAL_STEPS}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-slate-200/70 overflow-hidden mb-5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}
            />
          </div>

          {/* Step trail */}
          <div className="flex gap-1.5 mb-8">
            {stepMeta.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i <= step ? '#A855F7' : 'rgba(226,232,240,0.85)' }} />
                <span className="text-xs font-mono hidden sm:block truncate max-w-full"
                  style={{ color: i === step ? '#C084FC' : i < step ? 'rgba(15,23,42,0.52)' : 'rgba(15,23,42,0.32)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase mb-2">Dreamer Profile · Step {step + 1}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>
            {stepMeta[step].question}
          </h1>
        </div>

        {/* Step content */}
        <div className="animate-slide-up" key={step}>

          {/* Q1 — Domain */}
          {step === 0 && (
            <div className="space-y-3">
              {domains.map(d => {
                const active = profile.domain === d.value
                return (
                  <button
                    key={d.value}
                    onClick={() => setProfile(p => ({ ...p, domain: d.value, specializations: [], roles: [] }))}
                    className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center gap-4"
                    style={{
                      background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.74)',
                      border: `1px solid ${active ? 'rgba(124,58,237,0.6)' : 'rgba(226,232,240,0.78)'}`,
                      boxShadow: active ? '0 0 24px rgba(124,58,237,0.2)' : 'none',
                    }}
                  >
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <div className="text-slate-900 font-semibold text-sm">{d.value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{d.sub}</div>
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: '#A855F7' }} />}
                  </button>
                )
              })}
            </div>
          )}

          {/* Q2 — Specialization */}
          {step === 1 && (
            <MultiSelectGrid
              options={specializations}
              selected={profile.specializations}
              onToggle={v => toggle('specializations', v)}
            />
          )}

          {/* Q3 — Roles */}
          {step === 2 && (
            <MultiSelectGrid
              options={roles}
              selected={profile.roles}
              onToggle={v => toggle('roles', v)}
            />
          )}

          {/* Q4 — Skills to acquire */}
          {step === 3 && (
            <div>
              <p className="text-slate-500 text-xs font-mono mb-4">Select all that interest you</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skillsToAcquire.map(skill => {
                  const active = profile.skillsToAcquire.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggle('skillsToAcquire', skill)}
                      className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.74)',
                        border: `1px solid ${active ? 'rgba(124,58,237,0.6)' : 'rgba(226,232,240,0.78)'}`,
                        color: active ? '#A855F7' : 'rgba(15,23,42,0.68)',
                      }}
                    >
                      {active && <span className="mr-1.5">✓</span>}{skill}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Q5 — Baseline skills */}
          {step === 4 && (
            <div>
              <p className="text-slate-500 text-xs font-mono mb-4">Be honest — this helps us calibrate your starting point</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {baselineSkills.map(skill => {
                  const active = profile.baselineSkills.includes(skill)
                  const isNone = skill === 'None / Complete Beginner'
                  return (
                    <button
                      key={skill}
                      onClick={() => {
                        if (isNone) {
                          setProfile(p => ({ ...p, baselineSkills: active ? [] : ['None / Complete Beginner'] }))
                        } else {
                          const filtered = profile.baselineSkills.filter(s => s !== 'None / Complete Beginner')
                          const next = filtered.includes(skill) ? filtered.filter(s => s !== skill) : [...filtered, skill]
                          setProfile(p => ({ ...p, baselineSkills: next }))
                        }
                      }}
                      className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.74)',
                        border: `1px solid ${active ? 'rgba(124,58,237,0.6)' : 'rgba(226,232,240,0.78)'}`,
                        color: active ? '#A855F7' : 'rgba(15,23,42,0.68)',
                      }}
                    >
                      {active && <span className="mr-1.5">✓</span>}{skill}
                    </button>
                  )
                })}
              </div>
              <p className="text-slate-400 text-xs font-mono mt-3">{profile.baselineSkills.length} selected</p>
            </div>
          )}

          {/* Q6 — Goal */}
          {step === 5 && (
            <div className="space-y-3">
              {goals.map(g => {
                const active = profile.goal === g.value
                return (
                  <button
                    key={g.value}
                    onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                    className="w-full text-left px-6 py-5 rounded-xl transition-all duration-200 flex items-center gap-4"
                    style={{
                      background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.74)',
                      border: `1px solid ${active ? 'rgba(124,58,237,0.6)' : 'rgba(226,232,240,0.78)'}`,
                      boxShadow: active ? '0 0 24px rgba(124,58,237,0.2)' : 'none',
                    }}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="text-slate-900 font-semibold text-sm">{g.value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{g.sub}</div>
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: '#A855F7' }} />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canProceed() ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(226,232,240,0.85)',
              boxShadow: canProceed() ? '0 0 32px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            {step < TOTAL_STEPS - 1 ? 'Continue →' : 'Start Skill Quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}
