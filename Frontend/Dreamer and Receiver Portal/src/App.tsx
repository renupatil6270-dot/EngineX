import { useState } from 'react'
import PortalSelect from './components/PortalSelect'
import DreamerOnboarding from './components/DreamerOnboarding'
import PursuerOnboarding from './components/PursuerOnboarding'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Roadmap from './components/Roadmap'

export type Portal = 'dreamer' | 'pursuer'
export type Screen = 'portal' | 'onboarding' | 'quiz' | 'results' | 'roadmap'

export interface QuizAnswer {
  questionId: number
  category: string
  correct: boolean
}

export interface DreamerProfile {
  domain: string
  specializations: string[]
  roles: string[]
  skillsToAcquire: string[]
  baselineSkills: string[]
  goal: string
}

export interface PursuerProfile {
  domain: string
  specializations: string[]
  roles: string[]
  currentSkills: string[]
  timeline: string
  validationStyle: string[]
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('portal')
  const [portal, setPortal] = useState<Portal>('dreamer')
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [dreamerProfile, setDreamerProfile] = useState<DreamerProfile | null>(null)
  const [pursuerProfile, setPursuerProfile] = useState<PursuerProfile | null>(null)

  const handlePortalSelect = (p: Portal) => {
    setPortal(p)
    setScreen('onboarding')
  }

  const handleDreamerComplete = (profile: DreamerProfile) => {
    setDreamerProfile(profile)
    setScreen('quiz')
  }

  const handlePursuerComplete = (profile: PursuerProfile) => {
    setPursuerProfile(profile)
    setScreen('quiz')
  }

  const handleQuizComplete = (ans: QuizAnswer[]) => {
    setAnswers(ans)
    setScreen('results')
  }

  const handleViewRoadmap = () => setScreen('roadmap')

  const handleRestart = () => {
    setScreen('portal')
    setAnswers([])
    setDreamerProfile(null)
    setPursuerProfile(null)
  }

  return (
    <div className="app-shell min-h-screen">
      {screen === 'portal' && <PortalSelect onSelect={handlePortalSelect} />}
      {screen === 'onboarding' && portal === 'dreamer' && (
        <DreamerOnboarding onComplete={handleDreamerComplete} onBack={() => setScreen('portal')} />
      )}
      {screen === 'onboarding' && portal === 'pursuer' && (
        <PursuerOnboarding onComplete={handlePursuerComplete} onBack={() => setScreen('portal')} />
      )}
      {screen === 'quiz' && <Quiz portal={portal} onComplete={handleQuizComplete} />}
      {screen === 'results' && (
        <Results portal={portal} answers={answers} onViewRoadmap={handleViewRoadmap} onRestart={handleRestart} />
      )}
      {screen === 'roadmap' && (
        <Roadmap
          portal={portal}
          answers={answers}
          dreamerProfile={dreamerProfile}
          pursuerProfile={pursuerProfile}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
