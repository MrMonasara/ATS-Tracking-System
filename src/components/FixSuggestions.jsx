import { AlertTriangle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const PRIORITY_CONFIG = {
  critical: {
    icon: <AlertTriangle size={14} />,
    label: 'Critical',
    bg: 'rgba(255,101,132,0.08)',
    border: 'rgba(255,101,132,0.25)',
    badgeBg: 'rgba(255,101,132,0.15)',
    badgeText: '#ff6584',
    headerText: '#ff6584',
  },
  important: {
    icon: <AlertCircle size={14} />,
    label: 'Important',
    bg: 'rgba(247,151,30,0.08)',
    border: 'rgba(247,151,30,0.25)',
    badgeBg: 'rgba(247,151,30,0.15)',
    badgeText: '#f7971e',
    headerText: '#f7971e',
  },
  good: {
    icon: <CheckCircle size={14} />,
    label: 'Already Good',
    bg: 'rgba(67,233,123,0.08)',
    border: 'rgba(67,233,123,0.25)',
    badgeBg: 'rgba(67,233,123,0.15)',
    badgeText: '#43e97b',
    headerText: '#43e97b',
  },
}

function FixCard({ fix, index }) {
  const [open, setOpen] = useState(fix.priority === 'critical')
  const cfg = PRIORITY_CONFIG[fix.priority] || PRIORITY_CONFIG.important

  return (
    <div
      className="rounded-xl border overflow-hidden animate-fadeIn card-hover"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        animationDelay: `${index * 80}ms`,
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ color: cfg.headerText }}>{cfg.icon}</span>
          <span className="text-sm font-semibold font-dm text-white truncate">{fix.title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0 font-syne"
            style={{ background: cfg.badgeBg, color: cfg.badgeText }}
          >
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {fix.scoreImpact > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#43e97b]">
              <TrendingUp size={11} />+{fix.scoreImpact}
            </span>
          )}
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
          <p className="text-xs text-gray-400 font-dm">
            <span className="text-gray-300 font-semibold">Issue: </span>
            {fix.issue}
          </p>
          <p className="text-xs text-gray-400 font-dm">
            <span className="text-gray-300 font-semibold">Action: </span>
            {fix.action}
          </p>
          {fix.example && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#0a0a0f] border border-[#1e1e32] text-xs text-gray-300 font-dm italic">
              "{fix.example}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function FixSuggestions({ fixes, strengths }) {
  const critical = fixes.filter(f => f.priority === 'critical')
  const important = fixes.filter(f => f.priority === 'important')
  const good = fixes.filter(f => f.priority === 'good')

  const totalGain = fixes
    .filter(f => f.priority !== 'good')
    .reduce((sum, f) => sum + (f.scoreImpact || 0), 0)

  return (
    <div className="space-y-3">
      {totalGain > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#6c63ff15] border border-[#6c63ff30]">
          <TrendingUp size={14} className="text-[#6c63ff]" />
          <span className="text-sm text-gray-300 font-dm">
            Fixing all issues could add up to{' '}
            <span className="text-[#6c63ff] font-semibold">+{totalGain} points</span>
          </span>
        </div>
      )}

      {critical.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#ff6584] font-syne font-semibold">🚨 Critical ({critical.length})</p>
          {critical.map((f, i) => <FixCard key={i} fix={f} index={i} />)}
        </div>
      )}

      {important.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#f7971e] font-syne font-semibold mt-3">⚠️ Important ({important.length})</p>
          {important.map((f, i) => <FixCard key={i} fix={f} index={i} />)}
        </div>
      )}

      {good.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#43e97b] font-syne font-semibold mt-3">✅ Already Good ({good.length})</p>
          {good.map((f, i) => <FixCard key={i} fix={f} index={i} />)}
        </div>
      )}

      {strengths && strengths.length > 0 && (
        <div className="mt-4 p-4 rounded-xl border border-[#43e97b25] bg-[#43e97b08]">
          <p className="text-xs uppercase tracking-widest text-[#43e97b] font-syne font-semibold mb-2">Your Strengths</p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 font-dm flex items-start gap-2">
                <span className="text-[#43e97b] mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
