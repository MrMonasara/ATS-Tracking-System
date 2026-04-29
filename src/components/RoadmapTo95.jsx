import { Clock, TrendingUp, Target } from 'lucide-react'

const EFFORT_COLOR = {
  '5 min': '#43e97b',
  '15 min': '#6c63ff',
  '30 min': '#f7971e',
  '1 hr': '#ff6584',
}

export default function RoadmapTo95({ roadmap, currentScore }) {
  const totalGain = roadmap.reduce((sum, s) => sum + (s.scoreGain || 0), 0)
  const projectedScore = Math.min(100, currentScore + totalGain)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#1e1e32] text-center">
          <p className="text-xl font-syne font-bold text-white">{currentScore}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Current</p>
        </div>
        <div className="p-3 rounded-xl bg-[#6c63ff15] border border-[#6c63ff30] text-center">
          <p className="text-xl font-syne font-bold text-[#6c63ff]">+{totalGain}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Potential</p>
        </div>
        <div className="p-3 rounded-xl bg-[#43e97b12] border border-[#43e97b25] text-center">
          <p className="text-xl font-syne font-bold text-[#43e97b]">{projectedScore}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Projected</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-px bg-[#1e1e32]" />
        <div className="space-y-3">
          {roadmap.map((step, i) => {
            const effortColor = EFFORT_COLOR[step.effort] || '#6c63ff'
            return (
              <div
                key={i}
                className="flex gap-4 animate-fadeIn"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-syne font-bold shrink-0 z-10 border"
                  style={{ background: '#0a0a0f', borderColor: '#6c63ff40', color: '#6c63ff' }}
                >
                  {step.step || i + 1}
                </div>
                <div className="flex-1 p-3.5 rounded-xl border border-[#1e1e32] bg-[#13131f] card-hover">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-white font-syne leading-snug">{step.action}</p>
                    {step.scoreGain > 0 && (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-[#43e97b] bg-[#43e97b15] px-2 py-0.5 rounded-full shrink-0">
                        <TrendingUp size={10} />+{step.scoreGain}
                      </span>
                    )}
                  </div>
                  {step.detail && (
                    <p className="text-xs text-gray-500 font-dm mb-2 leading-relaxed">{step.detail}</p>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} style={{ color: effortColor }} />
                    <span className="text-xs font-dm" style={{ color: effortColor }}>{step.effort}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-[#6c63ff10] border border-[#6c63ff20]">
        <Target size={14} className="text-[#6c63ff] mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400 font-dm leading-relaxed">
          These are the highest-impact changes specific to <em>this</em> job description. Focus on steps 1–3 first — they'll give the biggest score boost with the least effort.
        </p>
      </div>
    </div>
  )
}
