import { useState } from 'react'
import type { PursuerProfile } from '../App'
import EngineXLogo from './EngineXLogo'

interface Props {
  onComplete: (profile: PursuerProfile) => void
  onBack: () => void
}

const TOTAL_STEPS = 6

const domains = [
  'Web Development',
  'Data Science & AI',
  'Cybersecurity',
  'Cloud & DevOps',
  'Mobile App Development',
  'Embedded Systems',
]

const specializationsByDomain: Record<string, string[]> = {
  'Web Development': ['Frontend Engineering', 'Backend Engineering', 'Full-Stack Engineering', 'UI/UX Design'],
  'Data Science & AI': ['Machine Learning', 'Data Engineering', 'AI Research', 'Data Analytics'],
  'Cybersecurity': ['Penetration Testing', 'Security Engineering', 'Cloud Security', 'Forensics'],
  'Cloud & DevOps': ['Cloud Architecture', 'DevOps Engineering', 'Site Reliability Engineering', 'Platform Engineering'],
  'Mobile App Development': ['iOS Engineering', 'Android Engineering', 'React Native', 'Flutter'],
  'Embedded Systems': ['Firmware Engineering', 'RTOS Development', 'IoT Systems', 'Hardware-Software Integration'],
}

const rolesByDomain: Record<string, string[]> = {
  'Web Development': ['Full-Stack Developer', 'Frontend Engineer', 'Backend Engineer', 'UI/UX Designer', 'Tech Lead'],
  'Data Science & AI': ['Data Scientist', 'ML Engineer', 'MLOps Engineer', 'Data Engineer', 'AI Researcher'],
  'Cybersecurity': ['Security Analyst', 'Penetration Tester', 'Security Architect', 'SOC Analyst', 'CISO'],
  'Cloud & DevOps': ['DevOps Engineer', 'Cloud Architect', 'SRE', 'Platform Engineer', 'Infrastructure Lead'],
  'Mobile App Development': ['iOS Developer', 'Android Developer', 'Mobile Architect', 'React Native Developer'],
  'Embedded Systems': ['Firmware Engineer', 'Embedded Software Engineer', 'IoT Developer', 'Systems Architect'],
}

const allSkills = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust',
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'FastAPI', 'Django', 'Spring Boot',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD', 'Terraform',
  'AWS', 'GCP', 'Azure',
  'Git', 'REST APIs', 'GraphQL',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
  'Linux', 'Bash', 'Networking Basics',
]

const timelines = [
  { value: '1 Month', label: '1 Month', sub: 'Intensive Crash Course', icon: '⚡' },
  { value: '3 Months', label: '3 Months', sub: 'Standard Path', icon: '📅' },
  { value: '6 Months', label: '6 Months', sub: 'In-Depth Mastery', icon: '🎓' },
]

const validationStyles = [
  { value: 'Building hands-on projects', icon: '🔨' },
  { value: 'AI-generated topic quizzes', icon: '🤖' },
  { value: 'Syllabus alignment / Exam prep', icon: '📚' },
  { value: 'Coding challenges', icon: '💻' },
]

const stepMeta = [
  { label: 'Domain', question: 'What domain are you interested in?' },
  { label: 'Specialization', question: 'What is your specialization?' },
  { label: 'Target Roles', question: 'What roles do you look forward to?' },
  { label: 'Current Skills', question: 'What skills do you currently have?' },
  { label: 'Timeline', question: 'What is your target timeline?' },
  { label: 'Validation', question: 'How do you prefer to validate progress?' },
]

function MultiSelectGrid({ options, selected, onToggle, cols = 2 }: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  cols?: number
}) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
            style={{
              background: active ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.74)',
              border: `1px solid ${active ? 'rgba(20,184,166,0.6)' : 'rgba(226,232,240,0.78)'}`,
              color: active ? '#2DD4BF' : 'rgba(15,23,42,0.68)',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function PursuerOnboarding({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<PursuerProfile>({
    domain: '',
    specializations: [],
    roles: [],
    currentSkills: [],
    timeline: '',
    validationStyle: [],
  })
  const [skillSearch, setSkillSearch] = useState('')

  const progress = ((step) / TOTAL_STEPS) * 100

  const toggle = (field: keyof PursuerProfile, value: string) => {
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
    if (step === 3) return profile.currentSkills.length > 0
    if (step === 4) return profile.timeline !== ''
    if (step === 5) return profile.validationStyle.length > 0
    return false
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else onComplete(profile)
  }

  const filteredSkills = skillSearch
    ? allSkills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
    : allSkills

  const specializations = specializationsByDomain[profile.domain] || []
  const roles = rolesByDomain[profile.domain] || []

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-15" style={{ background: '#14B8A6' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-10" style={{ background: '#3B82F6' }} />
      </div>

      <div className="w-full max-w-xl relative">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <button onClick={step === 0 ? onBack : () => setStep(s => s - 1)}
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-mono flex items-center gap-1">
              ← {step === 0 ? 'Back to portals' : 'Previous'}
            </button>
            <EngineXLogo size={28} showText={false} />
            <span className="text-slate-400 text-xs font-mono">{step + 1} / {TOTAL_STEPS}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-slate-200/70 overflow-hidden mb-6">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress + (100 / TOTAL_STEPS)}%`, background: 'linear-gradient(90deg, #14B8A6, #3B82F6)' }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex gap-1.5 mb-8">
            {stepMeta.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i <= step ? '#14B8A6' : 'rgba(226,232,240,0.85)' }} />
                <span className="text-slate-400 text-xs font-mono hidden sm:block truncate max-w-full"
                  style={{ color: i === step ? '#2DD4BF' : i < step ? 'rgba(15,23,42,0.52)' : 'rgba(15,23,42,0.32)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase mb-2">Pursuer Profile · Step {step + 1}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>
            {stepMeta[step].question}
          </h1>
        </div>

        {/* Step content */}
        <div className="animate-slide-up" key={step}>

          {/* Q1 — Domain: single choice */}
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domains.map(d => {
                const active = profile.domain === d
                return (
                  <button key={d} onClick={() => setProfile(p => ({ ...p, domain: d, specializations: [], roles: [] }))}
                    className="text-left px-5 py-4 rounded-xl transition-all duration-200"
                    style={{
                      background: active ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.74)',
                      border: `1px solid ${active ? 'rgba(20,184,166,0.6)' : 'rgba(226,232,240,0.78)'}`,
                      color: active ? '#2DD4BF' : 'rgba(15,23,42,0.68)',
                      boxShadow: active ? '0 0 20px rgba(20,184,166,0.2)' : 'none',
                    }}>
                    <div className="font-medium text-sm">{d}</div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Q2 — Specialization: multi-select */}
          {step === 1 && (
            <MultiSelectGrid
              options={specializations.length ? specializations : ['Frontend Engineering', 'Backend Engineering', 'Full-Stack Engineering', 'UI/UX Design']}
              selected={profile.specializations}
              onToggle={v => toggle('specializations', v)}
            />
          )}

          {/* Q3 — Roles: multi-select */}
          {step === 2 && (
            <MultiSelectGrid
              options={roles.length ? roles : ['Full-Stack Developer', 'Backend Engineer', 'ML Ops Engineer', 'Data Scientist', 'DevOps Specialist', 'System Architect']}
              selected={profile.roles}
              onToggle={v => toggle('roles', v)}
            />
          )}

          {/* Q4 — Skills: searchable multi-select */}
          {step === 3 && (
            <div>
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl mb-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(148,163,184,0.30)' }}
              />
              {profile.currentSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.currentSkills.map(s => (
                    <span key={s}
                      onClick={() => toggle('currentSkills', s)}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-full font-mono transition-all"
                      style={{ background: 'rgba(20,184,166,0.2)', border: '1px solid rgba(20,184,166,0.5)', color: '#2DD4BF' }}>
                      {s} ✕
                    </span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(226,232,240,0.85) transparent' }}>
                {filteredSkills.map(skill => {
                  const active = profile.currentSkills.includes(skill)
                  return (
                    <button key={skill} onClick={() => toggle('currentSkills', skill)}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150"
                      style={{
                        background: active ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.74)',
                        border: `1px solid ${active ? 'rgba(20,184,166,0.5)' : 'rgba(226,232,240,0.72)'}`,
                        color: active ? '#2DD4BF' : 'rgba(15,23,42,0.62)',
                      }}>
                      {active ? '✓ ' : ''}{skill}
                    </button>
                  )
                })}
              </div>
              <p className="text-slate-400 text-xs font-mono mt-3">{profile.currentSkills.length} skill{profile.currentSkills.length !== 1 ? 's' : ''} selected</p>
            </div>
          )}

          {/* Q5 — Timeline: single choice with sub-label */}
          {step === 4 && (
            <div className="space-y-3">
              {timelines.map(t => {
                const active = profile.timeline === t.value
                return (
                  <button key={t.value} onClick={() => setProfile(p => ({ ...p, timeline: t.value }))}
                    className="w-full text-left px-6 py-5 rounded-xl transition-all duration-200 flex items-center gap-4"
                    style={{
                      background: active ? 'rgba(20,184,166,0.18)' : 'rgba(255,255,255,0.74)',
                      border: `1px solid ${active ? 'rgba(20,184,166,0.6)' : 'rgba(226,232,240,0.78)'}`,
                      boxShadow: active ? '0 0 24px rgba(20,184,166,0.2)' : 'none',
                    }}>
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <div className="text-slate-900 font-semibold text-sm">{t.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{t.sub}</div>
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#14B8A6' }} />}
                  </button>
                )
              })}
            </div>
          )}

          {/* Q6 — Validation: multi-select */}
          {step === 5 && (
            <div className="space-y-3">
              {validationStyles.map(v => {
                const active = profile.validationStyle.includes(v.value)
                return (
                  <button key={v.value} onClick={() => toggle('validationStyle', v.value)}
                    className="w-full text-left px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-4"
                    style={{
                      background: active ? 'rgba(20,184,166,0.18)' : 'rgba(255,255,255,0.74)',
                      border: `1px solid ${active ? 'rgba(20,184,166,0.6)' : 'rgba(226,232,240,0.78)'}`,
                    }}>
                    <span className="text-xl">{v.icon}</span>
                    <span className="text-sm" style={{ color: active ? '#2DD4BF' : 'rgba(15,23,42,0.68)' }}>{v.value}</span>
                    {active && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#14B8A6' }} />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-end animate-slide-up">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canProceed() ? 'linear-gradient(135deg, #14B8A6, #3B82F6)' : 'rgba(226,232,240,0.85)',
              boxShadow: canProceed() ? '0 0 32px rgba(20,184,166,0.35)' : 'none',
            }}
          >
            {step < TOTAL_STEPS - 1 ? 'Continue →' : 'Start Skill Quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}
