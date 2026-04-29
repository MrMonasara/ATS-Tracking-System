import { useEffect, useState } from 'react'

const CATEGORIES = [
  { key: 'technicalSkills', label: 'Technical Skills Match', icon: '⚙️' },
  { key: 'coreKeywords', label: 'Core Role Keywords', icon: '🔑' },
  { key: 'education', label: 'Education & Eligibility', icon: '🎓' },
  { key: 'experience', label: 'Experience Relevance', icon: '💼' },
  { key: 'format', label: 'Resume Format Quality', icon: '📄' },
  { key: 'domain', label: 'Domain Alignment', icon: '🎯' },
]

function getBarColor(score) {
  if (score >= 80) return '#43e97b'
  if (score >= 60) return '#ffd200'
  if (score >= 40) return '#f7971e'
  return '#ff6584'
}

function BreakdownBar({ label, icon, score }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 150)
    return () => clearTimeout(t)
  }, [score])

  const color = getBarColor(score)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-dm text-gray-300 flex items-center gap-2">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-sm font-semibold font-syne" style={{ color }}>{score}</span>
      </div>
      <div className="h-2 rounded-full bg-[#1e1e32] overflow-hidden">
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}

export default function ScoreBreakdown({ breakdown }) {
  const avg = Math.round(
    Object.values(breakdown).reduce((a, b) => a + b, 0) / Object.values(breakdown).length
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400 font-dm">6 categories evaluated</span>
        <span className="text-sm font-syne text-gray-400">
          Avg: <span className="text-white font-semibold">{avg}</span>
        </span>
      </div>
      {CATEGORIES.map(({ key, label, icon }) => (
        <BreakdownBar key={key} label={label} icon={icon} score={breakdown[key] ?? 0} />
      ))}
    </div>
  )
}
