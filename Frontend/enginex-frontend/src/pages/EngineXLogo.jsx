import React from 'react';
export default function EngineXLogo({ size = 40, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* EX mark — E + X combined, graphite silver on light glass */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="40%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="silverX" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* E shape — rounded rectangle with three horizontal bars */}
        {/* Outer rounded-rect outline for E */}
        <rect x="8" y="12" width="46" height="76" rx="10" ry="10"
          fill="none" stroke="url(#silver)" strokeWidth="7" />
        {/* Middle cut-out: right side of E open */}
        <rect x="35" y="12" width="20" height="76" fill="#F4F5F7" />
        {/* Three horizontal bars of E */}
        <rect x="8" y="12" width="46" height="9" rx="4" fill="url(#silver)" />
        <rect x="8" y="45" width="38" height="8" rx="3" fill="url(#silver)" />
        <rect x="8" y="79" width="46" height="9" rx="4" fill="url(#silver)" />

        {/* X shape — two crossing diagonal strokes */}
        {/* Top-left to bottom-right */}
        <line x1="52" y1="12" x2="94" y2="88" stroke="url(#silverX)" strokeWidth="9" strokeLinecap="round" />
        {/* Top-right to bottom-left */}
        <line x1="94" y1="12" x2="52" y2="88" stroke="url(#silverX)" strokeWidth="9" strokeLinecap="round" />

        {/* Tiny circuit dot top-left of E (decoration) */}
        <circle cx="22" cy="33" r="2.5" fill="#60A5FA" opacity="0.7" />
        <line x1="24.5" y1="33" x2="32" y2="33" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="33" x2="32" y2="27" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />

        {/* Tiny gear decoration top-right of X (simplified) */}
        <circle cx="82" cy="26" r="5" fill="none" stroke="#93C5FD" strokeWidth="1.5" opacity="0.6" />
        <circle cx="82" cy="26" r="2.5" fill="#93C5FD" opacity="0.5" />
      </svg>

      {showText && (
        <div>
          <span className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Fraunces, serif' }}>
            Engine<span style={{ background: 'linear-gradient(90deg,#A78BFA,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>X</span>
          </span>
        </div>
      )}
    </div>
  )
}
