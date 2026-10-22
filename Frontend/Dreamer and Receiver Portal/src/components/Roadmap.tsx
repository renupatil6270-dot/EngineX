import { useState } from 'react'
import type { Portal, QuizAnswer, DreamerProfile, PursuerProfile } from '../App'

interface Props {
  portal: Portal
  answers: QuizAnswer[]
  dreamerProfile?: DreamerProfile | null
  pursuerProfile?: PursuerProfile | null
  onRestart: () => void
}

interface Resource {
  name: string
  type: 'free' | 'paid' | 'book' | 'practice'
  url: string
  note: string
}

interface RoadmapItem {
  week: string
  title: string
  overview: string
  whatYouWillLearn: string[]
  commonMistakes: string
  resources: Resource[]
  priority: 'critical' | 'important' | 'growth'
  category: string
}

const theme = {
  dreamer: { from: '#7C3AED', to: '#EC4899', accent: '#A855F7', light: 'rgba(124,58,237,0.15)', pill: 'rgba(124,58,237,0.25)' },
  pursuer: { from: '#14B8A6', to: '#3B82F6', accent: '#2DD4BF', light: 'rgba(20,184,166,0.12)', pill: 'rgba(20,184,166,0.2)' },
}

const priorityStyle = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: 'Critical Gap' },
  important: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: 'Important' },
  growth: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', label: 'Already Strong' },
}

const typeStyle = {
  free: { color: '#22C55E', label: 'Free' },
  paid: { color: '#F59E0B', label: 'Paid' },
  book: { color: '#A855F7', label: 'Book' },
  practice: { color: '#06B6D4', label: 'Practice' },
}

const roadmapByCategory: Record<string, Omit<RoadmapItem, 'priority'>> = {
  'Web Fundamentals': {
    week: 'Week 1',
    title: 'HTML Semantics & Accessibility',
    category: 'Web Fundamentals',
    overview: `HTML is the skeleton of everything on the web — but most people learn it wrong, treating every container as a <div>. Semantic HTML means using the right element for the right job: <article> for standalone content, <nav> for navigation, <main> for the primary content area, <aside> for supplementary material.\n\nWhy does this matter? Two reasons. First, screen readers and assistive technologies rely on semantic structure to navigate pages. Second, search engines weight semantic content differently. A heading inside an <h1> carries more meaning than a <div class="big-text">.\n\nStart here before anything else. It takes a week to get right and pays dividends forever.`,
    whatYouWillLearn: [
      'The full semantic element vocabulary (article, section, nav, aside, main, header, footer)',
      'ARIA roles and when to use them (and when NOT to — native semantics beat ARIA)',
      'Form accessibility: labels, fieldsets, legends, and proper input types',
      'The document outline algorithm and why heading hierarchy matters',
      'How to audit a page with a screen reader (VoiceOver or NVDA)',
    ],
    commonMistakes: "Using <div> and <span> for everything. Skipping heading levels (h1 → h3). Adding ARIA roles to elements that already have native semantics. Forgetting alt text — or writing useless alt text like 'image'.",
    resources: [
      { name: 'MDN HTML Elements Reference', type: 'free', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', note: 'The definitive reference. Bookmark it.' },
      { name: 'web.dev Learn HTML', type: 'free', url: 'https://web.dev/learn/html', note: 'Google\'s structured course — excellent for semantic depth.' },
      { name: 'The A11Y Project Checklist', type: 'free', url: 'https://www.a11yproject.com/checklist/', note: 'A practical accessibility audit you can run on any page.' },
      { name: 'HTML5 Doctor', type: 'free', url: 'http://html5doctor.com/', note: 'Great articles on when to use which semantic element.' },
    ],
  },
  'CSS': {
    week: 'Weeks 1–2',
    title: 'CSS Layout Mastery',
    category: 'CSS',
    overview: `CSS has a reputation for being frustrating, but that frustration almost always comes from not understanding how it actually thinks. CSS is a constraint-based system — elements have natural dimensions, flow follows rules, and layout algorithms (normal flow, flex, grid) each solve different problems.\n\nThe two layout tools you need to master are Flexbox (for one-dimensional layouts — rows or columns) and Grid (for two-dimensional layouts — rows AND columns simultaneously). Most modern UIs are built with a combination of both.\n\nBeyond layout: custom properties (CSS variables) let you build design tokens into your stylesheet. Cascade layers give you explicit control over specificity. Container queries let components adapt to their container, not just the viewport.`,
    whatYouWillLearn: [
      'Flexbox: main axis, cross axis, flex-grow/shrink/basis, alignment',
      'Grid: explicit vs implicit grids, fr units, grid-template-areas, auto-placement',
      'The cascade: specificity, inheritance, and the new @layer rule',
      'Custom properties (CSS variables) and how to build a token system',
      'Responsive design: clamp(), min/max/fit-content, container queries',
    ],
    commonMistakes: "Using Flexbox for everything when Grid would be cleaner. Overriding specificity with !important instead of restructuring. Not understanding that margin collapsing exists. Writing breakpoints in px instead of using fluid typography with clamp().",
    resources: [
      { name: 'Every Layout', type: 'paid', url: 'https://every-layout.dev', note: 'The best CSS layout resource that exists. ~$30, worth every cent.' },
      { name: 'Josh W Comeau\'s CSS for JS Devs', type: 'paid', url: 'https://css-for-js.dev', note: 'Rebuilds your mental model from scratch. Highly recommended.' },
      { name: 'Flexbox Froggy', type: 'free', url: 'https://flexboxfroggy.com', note: 'Learn Flexbox by moving frogs. Genuinely effective.' },
      { name: 'CSS Grid Garden', type: 'free', url: 'https://cssgridgarden.com', note: 'Same concept for Grid. Covers ~80% of what you need.' },
      { name: 'MDN CSS Reference', type: 'free', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', note: 'Every property, every value. Your daily companion.' },
    ],
  },
  'JavaScript': {
    week: 'Weeks 1–3',
    title: 'JavaScript Deep Dive',
    category: 'JavaScript',
    overview: `JavaScript is one of the most misunderstood languages in existence — partly because it's easy to start with, and partly because its quirks are genuinely unusual. Most developers learn "enough JS to get by" and then wonder why their code behaves strangely in edge cases.\n\nThe things that trip people up most: the prototype chain (JS uses prototypal inheritance, not classical), closures (functions carry their lexical scope with them), the event loop (why setTimeout(fn, 0) doesn't run immediately), and async patterns (callbacks → Promises → async/await, and what each abstracts away).\n\nModern JS (ES2015+) is dramatically nicer: destructuring, spread, optional chaining, nullish coalescing, modules, and class syntax make code much cleaner. Know both old and new — you'll encounter both.`,
    whatYouWillLearn: [
      'The prototype chain and how inheritance actually works in JS',
      'Closures: lexical scope, variable capture, and practical use cases',
      'The event loop: call stack, task queue, microtask queue',
      'Promises: construction, chaining, error handling, Promise.all/allSettled/race',
      'async/await: what it desugars to and how errors propagate',
      'Modern syntax: destructuring, spread, optional chaining, nullish coalescing, modules',
    ],
    commonMistakes: "Not understanding that 'this' is set at call time, not definition time. Assuming async/await means synchronous. Mutating objects/arrays instead of creating new ones (especially in React). Confusing == and ===.",
    resources: [
      { name: 'javascript.info', type: 'free', url: 'https://javascript.info', note: 'The single best free JS resource. Read it cover to cover.' },
      { name: "You Don't Know JS (book series)", type: 'free', url: 'https://github.com/getify/You-Dont-Know-JS', note: 'Deep dives on scope, closures, this, prototypes. Free on GitHub.' },
      { name: 'Exercism JavaScript Track', type: 'free', url: 'https://exercism.org/tracks/javascript', note: 'Practice with mentor feedback. 100+ exercises.' },
      { name: 'JS Visualizer 9000', type: 'free', url: 'https://www.jsv9000.app', note: 'Visualize the event loop in real time. Essential for understanding async.' },
    ],
  },
  'React': {
    week: 'Weeks 3–5',
    title: 'React Patterns & Hooks',
    category: 'React',
    overview: `React's core idea is deceptively simple: UI is a function of state. You describe what the UI should look like for any given state, and React handles updating the DOM. The hard part is managing state correctly — knowing where to put it, how to pass it down, and when to use which tool.\n\nHooks replaced class components in 2019 and are now the standard. useState and useEffect cover 80% of cases. The remaining 20% — performance optimization, complex state machines, shared state — requires useCallback, useMemo, useReducer, and Context.\n\nThe most common React mistake is overusing useEffect. Before you reach for it, ask: is this a side effect that needs to sync with the outside world, or am I just computing something I could derive from existing state?`,
    whatYouWillLearn: [
      'The reconciliation algorithm: how React diffs and updates the DOM',
      'useState, useEffect, useRef — the core trio',
      'useCallback and useMemo: when they help, when they hurt',
      'useReducer: managing complex state transitions',
      'Context API: sharing state without prop drilling',
      'Component composition patterns: render props, compound components, slots',
    ],
    commonMistakes: "Putting everything in useEffect. Not providing stable dependency arrays. Storing derived state (things you can compute from existing state) in useState. Over-memoizing (useMemo and useCallback have a cost too). Not lifting state high enough.",
    resources: [
      { name: 'React Official Docs (react.dev)', type: 'free', url: 'https://react.dev', note: 'Completely rewritten in 2023. Interactive, excellent, use this first.' },
      { name: 'Josh W Comeau\'s Joy of React', type: 'paid', url: 'https://www.joyofreact.com', note: 'The best paid React course. Builds deep intuition, not just syntax.' },
      { name: "Kent C. Dodds' Blog", type: 'free', url: 'https://kentcdodds.com/blog', note: 'Especially his articles on useEffect, state management, and testing.' },
      { name: 'React TypeScript Cheatsheet', type: 'free', url: 'https://react-typescript-cheatsheet.netlify.app', note: 'When you start typing your React — this saves hours.' },
    ],
  },
  'Python': {
    week: 'Weeks 2–4',
    title: 'Python Fluency',
    category: 'Python',
    overview: `Python's reputation for simplicity is earned — its syntax is close to pseudocode, and the standard library covers an enormous range of tasks. But "knowing Python" and being fluent in Python are different things.\n\nFluency means: using list/dict/set comprehensions naturally, understanding generators and when they save memory, knowing the dunder methods that make objects behave like built-ins, using the standard library before reaching for third-party packages, and writing code that other Python developers immediately recognize as idiomatic.\n\nPython is the language of data science, ML, scripting, and backend development. Getting fluent here unlocks a huge amount of the tech landscape.`,
    whatYouWillLearn: [
      'List, dict, set, and generator comprehensions',
      'Iterators and generators: __iter__, __next__, yield',
      'Decorators: what they are, how to write them, common built-ins (@property, @staticmethod)',
      'Context managers: with statements and __enter__/__exit__',
      'The standard library: pathlib, collections, itertools, functools, datetime',
      'Type hints and how to use mypy for static analysis',
    ],
    commonMistakes: "Using a list when you need a set (O(n) vs O(1) lookup). Mutable default arguments (def fn(x=[]) is a famous bug). Not using enumerate() and zip(). Writing loops when a comprehension or map/filter would be cleaner.",
    resources: [
      { name: 'Python Official Tutorial', type: 'free', url: 'https://docs.python.org/3/tutorial/', note: 'Start here. The official tutorial is actually good.' },
      { name: 'Real Python', type: 'free', url: 'https://realpython.com', note: 'Deep, practical articles on every Python topic imaginable.' },
      { name: 'Fluent Python (book)', type: 'book', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', note: "Luciano Ramalho's masterwork. The book that makes you truly fluent." },
      { name: 'Exercism Python Track', type: 'free', url: 'https://exercism.org/tracks/python', note: '130+ exercises with mentor feedback. Best free practice resource.' },
    ],
  },
  'Algorithms': {
    week: 'Weeks 4–7',
    title: 'Algorithms & Data Structures',
    category: 'Algorithms',
    overview: `Algorithms and data structures are the vocabulary of problem-solving. You don't need to memorize 200 LeetCode solutions — you need to deeply understand about 15 core patterns, and then you can derive solutions to novel problems.\n\nThe patterns that matter most: two pointers, sliding window, binary search (and its variants), DFS/BFS on trees and graphs, dynamic programming (start with memoization, then tabulation), and heap/priority queue problems.\n\nTime complexity analysis (Big O) is the tool you use to reason about whether your solution is fast enough. Always know your solution's time AND space complexity before you're done.`,
    whatYouWillLearn: [
      'Big O notation: time and space complexity analysis',
      'Arrays, linked lists, stacks, queues — when to use each',
      'Hash tables: how they work, collision handling, O(1) average operations',
      'Trees: BFS vs DFS, binary search trees, heaps/priority queues',
      'Graphs: adjacency list vs matrix, BFS/DFS, shortest path (Dijkstra)',
      'Dynamic programming: recognizing DP problems, memoization, tabulation',
    ],
    commonMistakes: "Jumping to code before understanding the problem. Not considering edge cases (empty input, single element, all duplicates). Memorizing solutions instead of patterns. Ignoring space complexity.",
    resources: [
      { name: 'Neetcode.io Roadmap', type: 'free', url: 'https://neetcode.io/roadmap', note: 'The best structured DSA curriculum. Free videos + problem set.' },
      { name: 'LeetCode (Blind 75 / Neetcode 150)', type: 'free', url: 'https://leetcode.com', note: 'Work the 150-problem set in order. Quality over quantity.' },
      { name: 'Visualgo', type: 'free', url: 'https://visualgo.net', note: 'Visualize algorithms running step by step. Use before coding.' },
      { name: 'The Algorithm Design Manual (book)', type: 'book', url: 'https://www.algorist.com', note: "Skiena's book. More practical than CLRS, excellent war stories." },
    ],
  },
  'Databases': {
    week: 'Weeks 5–7',
    title: 'SQL & Database Design',
    category: 'Databases',
    overview: `Every serious application eventually needs to store and query data. SQL has been the dominant language for this for 50 years — and it's not going anywhere. The fundamentals of relational databases underpin almost everything: web apps, data pipelines, analytics.\n\nBeyond basic SELECT/INSERT/UPDATE, the real skill is writing efficient queries. That means understanding JOINs deeply (INNER, LEFT, RIGHT, FULL — and when each is appropriate), using CTEs (WITH clauses) for readability, window functions for analytics, and understanding what indexes do and when they help or hurt.\n\nDatabase design is equally important: normalization (eliminating redundancy), choosing the right data types, and modeling relationships correctly saves enormous pain later.`,
    whatYouWillLearn: [
      'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY — the full query structure',
      'JOINs: INNER, LEFT, RIGHT, FULL OUTER, CROSS, self-joins',
      'CTEs (WITH clauses) for readable, modular queries',
      'Window functions: ROW_NUMBER, RANK, LAG, LEAD, SUM OVER',
      'Indexes: clustered vs non-clustered, when they help, when they hurt',
      'Database normalization: 1NF, 2NF, 3NF and practical denormalization',
    ],
    commonMistakes: "Selecting * in production queries. Not using indexes on foreign keys. Writing subqueries where JOINs would be more efficient. Not understanding NULL behavior (NULL != NULL). Over-normalizing when denormalization would perform better.",
    resources: [
      { name: 'SQLZoo', type: 'free', url: 'https://sqlzoo.net', note: 'Interactive SQL exercises, browser-based. Best starting point.' },
      { name: 'pgexercises.com', type: 'free', url: 'https://pgexercises.com', note: 'PostgreSQL-focused exercises from basic to advanced window functions.' },
      { name: 'Mode SQL Tutorial', type: 'free', url: 'https://mode.com/sql-tutorial/', note: 'Excellent on analytics SQL and window functions specifically.' },
      { name: 'Designing Data-Intensive Applications (book)', type: 'book', url: 'https://dataintensive.net', note: "Kleppmann's masterwork. Read the first 3 chapters at minimum." },
    ],
  },
  'APIs / Networking': {
    week: 'Weeks 3–4',
    title: 'APIs & HTTP Fundamentals',
    category: 'APIs / Networking',
    overview: `REST APIs are the connective tissue of modern software. Your frontend talks to your backend via HTTP. Your backend talks to third-party services via HTTP. Understanding how HTTP works — not just "I call fetch() and get data back" — makes you dramatically more effective at debugging and designing systems.\n\nHTTP methods have semantic meaning: GET retrieves, POST creates, PUT replaces, PATCH partially updates, DELETE removes. Status codes communicate outcomes: 2xx success, 3xx redirect, 4xx client error, 5xx server error. Headers carry metadata: Content-Type, Authorization, Cache-Control.\n\nAuthentication is where most developers get confused. Know the difference between session-based auth, JWT tokens, and OAuth 2.0 — and when to use each.`,
    whatYouWillLearn: [
      'HTTP methods: GET, POST, PUT, PATCH, DELETE and their semantics',
      'Status codes: the full 2xx/3xx/4xx/5xx vocabulary',
      'Request/response headers: Content-Type, Authorization, CORS, caching',
      'REST conventions: resource naming, versioning, pagination patterns',
      'Authentication: sessions vs JWT vs OAuth 2.0',
      'Using browser DevTools Network tab to inspect real requests',
    ],
    commonMistakes: "Using GET for state-changing operations. Returning 200 with an error in the body (use the right status code!). Not handling CORS properly. Storing JWT tokens in localStorage (use httpOnly cookies instead).",
    resources: [
      { name: 'MDN HTTP Guide', type: 'free', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', note: 'The definitive HTTP reference. Start with the overview articles.' },
      { name: 'Postman Learning Center', type: 'free', url: 'https://learning.postman.com', note: 'Learn to test and explore APIs. Essential tool for any backend work.' },
      { name: 'HTTP Status Codes Reference', type: 'free', url: 'https://httpstatuses.io', note: 'Every status code with usage notes. Bookmark this.' },
      { name: 'OAuth 2.0 Simplified', type: 'free', url: 'https://www.oauth.com', note: "Aaron Parecki's guide. The clearest OAuth explanation available." },
    ],
  },
  'DevOps / Git': {
    week: 'Weeks 6–8',
    title: 'Git, CI/CD & Deployment',
    category: 'DevOps / Git',
    overview: `Git is non-negotiable. Every professional development environment uses it, and knowing Git beyond "git add . && git commit && git push" separates effective developers from frustrating teammates.\n\nThe things that actually matter in Git: understanding the DAG (directed acyclic graph) of commits, the difference between merge and rebase, interactive rebase for cleaning up history, and how to diagnose and recover from the common disaster scenarios (detached HEAD, accidental commits to main, merge conflicts).\n\nCI/CD (Continuous Integration/Continuous Deployment) automates the pipeline from code → tests → deployed software. GitHub Actions is the dominant tool for open-source projects. Understanding Docker — containers as isolated, reproducible environments — is increasingly expected.`,
    whatYouWillLearn: [
      'Git internals: commits, trees, blobs, refs — what .git actually contains',
      'Branching strategies: trunk-based development vs feature branches vs gitflow',
      'Rebase vs merge: when each is appropriate, interactive rebase',
      'Recovering from mistakes: reflog, reset (soft/mixed/hard), revert',
      'GitHub Actions: writing workflows for test, build, and deploy',
      'Docker basics: images, containers, Dockerfile, docker-compose',
    ],
    commonMistakes: "Force-pushing to shared branches. Not writing meaningful commit messages. Using git reset --hard without understanding what it does. Committing secrets/API keys (they live in git history forever). Not using .gitignore properly.",
    resources: [
      { name: 'Pro Git (free book)', type: 'book', url: 'https://git-scm.com/book/en/v2', note: 'The complete Git reference. Free online. Chapters 1-3 are essential.' },
      { name: 'Oh Shit, Git!?!', type: 'free', url: 'https://ohshitgit.com', note: 'How to recover from common Git disasters. Keep this bookmarked.' },
      { name: 'GitHub Actions Documentation', type: 'free', url: 'https://docs.github.com/en/actions', note: 'Official docs with examples. Start with the quickstart.' },
      { name: 'Play with Docker', type: 'free', url: 'https://labs.play-with-docker.com', note: 'Docker in the browser. Practice without installing anything.' },
    ],
  },
}

export default function Roadmap({ portal, answers, dreamerProfile, pursuerProfile, onRestart }: Props) {
  const t = theme[portal]
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'learn' | 'resources'>('overview')

  const categoryScores = answers.reduce<Record<string, { correct: number; total: number }>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = { correct: 0, total: 0 }
    acc[a.category].total++
    if (a.correct) acc[a.category].correct++
    return acc
  }, {})

  const roadmapItems: RoadmapItem[] = Object.entries(roadmapByCategory)
    .map(([cat, item]) => {
      const stats = categoryScores[cat]
      if (!stats) return { ...item, priority: 'growth' as const }
      const score = stats.correct / stats.total
      if (score < 0.5) return { ...item, priority: 'critical' as const }
      if (score < 0.8) return { ...item, priority: 'important' as const }
      return { ...item, priority: 'growth' as const }
    })
    .sort((a, b) => {
      const order = { critical: 0, important: 1, growth: 2 }
      return order[a.priority] - order[b.priority]
    })

  const toggleComplete = (cat: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const critical = roadmapItems.filter(i => i.priority === 'critical')
  const important = roadmapItems.filter(i => i.priority === 'important')
  const growth = roadmapItems.filter(i => i.priority === 'growth')
  const totalItems = roadmapItems.length
  const completedCount = completed.size
  const progressPct = Math.round((completedCount / totalItems) * 100)

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[300px] h-[500px] rounded-full blur-[150px] opacity-10" style={{ background: t.from }} />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase mb-3">Your Personalized Roadmap</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            {portal === 'dreamer' ? <>Your path to <span className="shimmer-text">building it.</span></> : 'Optimized learning path.'}
          </h1>
          <p className="text-slate-500 text-sm">
            {portal === 'dreamer' ? 'Every gap is a door, not a wall.' : 'Prioritized by impact. Sequenced by dependency.'}
          </p>
        </div>

        {/* Profile summary — Dreamer */}
        {dreamerProfile && portal === 'dreamer' && (
          <div className="rounded-2xl p-5 mb-6 animate-slide-up" style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <p className="text-violet-700 text-xs font-mono tracking-widest uppercase mb-3">Your Dreamer Profile</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-500 font-mono mb-1">Domain</p>
                <p className="text-slate-700">{dreamerProfile.domain}</p>
              </div>
              <div>
                <p className="text-slate-500 font-mono mb-1">Goal</p>
                <p className="text-slate-700">{dreamerProfile.goal}</p>
              </div>
              <div>
                <p className="text-slate-500 font-mono mb-1">Target Roles</p>
                <p className="text-slate-700">{dreamerProfile.roles.slice(0, 2).join(', ')}{dreamerProfile.roles.length > 2 ? ` +${dreamerProfile.roles.length - 2}` : ''}</p>
              </div>
              {dreamerProfile.skillsToAcquire.length > 0 && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-slate-500 font-mono mb-1">Skills to Build</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dreamerProfile.skillsToAcquire.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs font-mono"
                        style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#A855F7' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {dreamerProfile.baselineSkills.length > 0 && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-slate-500 font-mono mb-1">Already Know</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dreamerProfile.baselineSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs font-mono"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile summary — Pursuer */}
        {pursuerProfile && portal === 'pursuer' && (
          <div className="rounded-2xl p-5 mb-6 animate-slide-up" style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.2)' }}>
            <p className="text-teal-700 text-xs font-mono tracking-widest uppercase mb-3">Your Pursuer Profile</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-500 font-mono mb-1">Domain</p>
                <p className="text-slate-700">{pursuerProfile.domain}</p>
              </div>
              <div>
                <p className="text-slate-500 font-mono mb-1">Timeline</p>
                <p className="text-slate-700">{pursuerProfile.timeline}</p>
              </div>
              <div>
                <p className="text-slate-500 font-mono mb-1">Target Roles</p>
                <p className="text-slate-700">{pursuerProfile.roles.slice(0, 2).join(', ')}{pursuerProfile.roles.length > 2 ? ` +${pursuerProfile.roles.length - 2}` : ''}</p>
              </div>
              {pursuerProfile.currentSkills.length > 0 && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-slate-500 font-mono mb-1">Known Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pursuerProfile.currentSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs font-mono"
                        style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', color: '#2DD4BF' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress tracker */}
        <div className="rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.05s', background: 'rgba(255,255,255,0.68)', border: '1px solid rgba(148,163,184,0.26)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 font-semibold text-sm">Overall Progress</h2>
            <span className="text-slate-500 text-xs font-mono">{completedCount} / {totalItems} topics</span>
          </div>

          {/* Big progress bar */}
          <div className="w-full h-3 rounded-full bg-slate-200/70 overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${t.from}, ${t.to})` }}
            />
          </div>

          {/* Per-item dots */}
          <div className="flex flex-wrap gap-2">
            {roadmapItems.map(item => {
              const done = completed.has(item.category)
              const ps = priorityStyle[item.priority]
              return (
                <button
                  key={item.category}
                  onClick={(e) => toggleComplete(item.category, e)}
                  title={item.category}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-200"
                  style={{
                    background: done ? `${ps.color}22` : 'rgba(255,255,255,0.76)',
                    border: `1px solid ${done ? ps.color + '60' : 'rgba(226,232,240,0.85)'}`,
                    color: done ? ps.color : 'rgba(15,23,42,0.52)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  <span>{done ? '✓' : '○'}</span>
                  <span>{item.category}</span>
                </button>
              )
            })}
          </div>

          {completedCount === totalItems && (
            <p className="mt-4 text-center text-sm font-semibold shimmer-text">
              Roadmap complete. Time to build something real. 🚀
            </p>
          )}
        </div>

        {/* Summary counts */}
        <div className="grid grid-cols-3 gap-3 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Critical Gaps', count: critical.length, color: '#EF4444' },
            { label: 'To Strengthen', count: important.length, color: '#F59E0B' },
            { label: 'Already Strong', count: growth.length, color: '#22C55E' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Fraunces, serif' }}>{s.count}</div>
              <div className="text-xs text-slate-500 font-mono">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Roadmap sections */}
        {[
          { items: critical, label: 'Priority 1 — Close the Gaps', icon: '⚡' },
          { items: important, label: 'Priority 2 — Build Depth', icon: '📈' },
          { items: growth, label: 'Priority 3 — Sharpen Your Edge', icon: '🌱' },
        ].map((section, si) => section.items.length > 0 && (
          <div key={si} className="mb-8 animate-slide-up" style={{ animationDelay: `${0.15 + si * 0.08}s` }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">{section.icon}</span>
              <h2 className="text-slate-500 text-xs font-mono tracking-widest uppercase">{section.label}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map(item => {
                const ps = priorityStyle[item.priority]
                const isOpen = activeItem === item.category
                const isDone = completed.has(item.category)

                return (
                  <div key={item.category}
                    className="rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      background: isDone ? 'rgba(34,197,94,0.05)' : isOpen ? ps.bg : 'rgba(255,255,255,0.68)',
                      border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : isOpen ? ps.border : 'rgba(226,232,240,0.72)'}`,
                      opacity: isDone ? 0.65 : 1,
                    }}
                  >
                    {/* Card header — always visible */}
                    <div
                      className="flex items-center justify-between px-5 py-4 cursor-pointer"
                      onClick={() => setActiveItem(isOpen ? null : item.category)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Complete toggle */}
                        <button
                          onClick={(e) => toggleComplete(item.category, e)}
                          className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                          style={{
                            borderColor: isDone ? '#22C55E' : 'rgba(15,23,42,0.32)',
                            background: isDone ? 'rgba(34,197,94,0.2)' : 'transparent',
                            color: '#22C55E',
                          }}
                          title="Mark complete"
                        >
                          {isDone && <span className="text-xs">✓</span>}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-900 text-sm font-semibold" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                              {item.title}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0"
                              style={{ color: ps.color, background: ps.bg, border: `1px solid ${ps.border}` }}>
                              {ps.label}
                            </span>
                          </div>
                          <div className="text-slate-500 text-xs font-mono mt-0.5">{item.week}</div>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs ml-3 shrink-0 transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="border-t border-slate-200 animate-slide-up">
                        {/* Tab bar */}
                        <div className="flex border-b border-slate-200">
                          {(['overview', 'learn', 'resources'] as const).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className="px-5 py-3 text-xs font-mono uppercase tracking-wider transition-all duration-200"
                              style={{
                                color: activeTab === tab ? '#0F172A' : 'rgba(15,23,42,0.5)',
                                borderBottom: activeTab === tab ? `2px solid ${ps.color}` : '2px solid transparent',
                                background: activeTab === tab ? 'rgba(255,255,255,0.74)' : 'transparent',
                              }}
                            >
                              {tab === 'overview' ? '📖 Overview' : tab === 'learn' ? '🎯 What to Learn' : '🔗 Resources'}
                            </button>
                          ))}
                        </div>

                        <div className="p-5">
                          {/* Overview tab */}
                          {activeTab === 'overview' && (
                            <div>
                              {item.overview.split('\n\n').map((para, i) => (
                                <p key={i} className="text-slate-600 text-sm leading-relaxed mb-4 last:mb-0">
                                  {para}
                                </p>
                              ))}
                              <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <p className="text-xs font-mono text-red-700/80 uppercase tracking-wider mb-2">⚠ Common Mistakes</p>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.commonMistakes}</p>
                              </div>
                            </div>
                          )}

                          {/* Learn tab */}
                          {activeTab === 'learn' && (
                            <div>
                              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-4">By the end of this module you should be able to:</p>
                              <div className="space-y-3">
                                {item.whatYouWillLearn.map((point, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold mt-0.5"
                                      style={{ background: `${ps.color}22`, color: ps.color, border: `1px solid ${ps.color}40` }}>
                                      {i + 1}
                                    </span>
                                    <p className="text-slate-700 text-sm leading-relaxed">{point}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources tab */}
                          {activeTab === 'resources' && (
                            <div className="space-y-3">
                              {item.resources.map((r, i) => (
                                <a
                                  key={i}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group block"
                                  style={{ background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.24)' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                                    style={{ color: typeStyle[r.type].color, background: `${typeStyle[r.type].color}18`, border: `1px solid ${typeStyle[r.type].color}40` }}>
                                    {typeStyle[r.type].label}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                      <p className="text-slate-800 text-sm font-medium group-hover:text-slate-900 transition-colors">{r.name}</p>
                                      <span className="text-slate-400 text-xs group-hover:text-slate-600 transition-colors">↗</span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{r.note}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="rounded-2xl p-6 mb-8 animate-slide-up" style={{ background: t.light, border: '1px solid rgba(148,163,184,0.24)' }}>
          <p className="text-slate-600 text-sm leading-relaxed text-center">
            <span className="text-slate-900 font-semibold">Tip: </span>
            {portal === 'dreamer'
              ? 'Spend 2 focused hours daily. Ship something small every week — learning compounds when attached to real work.'
              : 'Block 90-minute deep work sessions. Track completions. Revisit this roadmap monthly and re-quiz quarterly.'}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300"
          style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})`, boxShadow: `0 14px 32px ${t.light}` }}
        >
          Retake Quiz
        </button>
      </div>
    </div>
  )
}
