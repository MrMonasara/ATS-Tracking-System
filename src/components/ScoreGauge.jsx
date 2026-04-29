import { useEffect, useState } from 'react'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getScoreConfig(score) {
  if (score >= 90) return { color: '#43e97b', label: 'Strong Pass', glow: 'score-glow-green', bg: 'rgba(67,233,123,0.1)', textColor: '#43e97b' }
  if (score >= 75) return { color: '#ffd200', label: 'Borderline', glow: 'score-glow-yellow', bg: 'rgba(255,210,0,0.1)', textColor: '#ffd200' }
  if (score >= 51) return { color: '#f7971e', label: 'Risky', glow: 'score-glow-orange', bg: 'rgba(247,151,30,0.1)', textColor: '#f7971e' }
  return { color: '#ff6584', label: 'Rejected', glow: 'score-glow-red', bg: 'rgba(255,101,132,0.1)', textColor: '#ff6584' }
}

export default function ScoreGauge({ score, verdict }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [score])

  const config = getScoreConfig(score)
  const progress = animated ? score / 100 : 0
  const dashoffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${config.glow}`}>
        <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="70" cy="70" r={RADIUS}
            fill="none"
            stroke="#1e1e32"
            strokeWidth="10"
          />
          {/* Fill */}
          <circle
            cx="70" cy="70" r={RADIUS}
            fill="none"
            stroke={config.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            className="gauge-circle"
            style={{ filter: `drop-shadow(0 0 8px ${config.color}80)` }}
          />
        </svg>

        {/* Score text inside */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span
            className="font-syne font-bold text-4xl leading-none"
            style={{ color: config.color }}
          >
            {animated ? score : 0}
          </span>
          <span className="text-xs text-gray-500 font-dm mt-1">/ 100</span>
        </div>
      </div>

      {/* Verdict pill */}
      <div
        className="px-5 py-1.5 rounded-full text-sm font-syne font-semibold border"
        style={{
          color: config.textColor,
          background: config.bg,
          borderColor: `${config.color}40`,
        }}
      >
        {verdict || config.label}
      </div>

      {/* Score scale indicator */}
      <div className="flex items-center gap-3 text-xs text-gray-500 font-dm">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          0–50 Rejected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          51–74
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          75–89
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          90+
        </span>
      </div>
    </div>
  )
}
