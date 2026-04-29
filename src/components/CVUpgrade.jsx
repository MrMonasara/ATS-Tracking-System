import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, Plus, AlertTriangle, CheckCircle, AlertCircle, Tag } from 'lucide-react'

const STATUS_CONFIG = {
  weak:        { label: 'Weak',        color: '#ff6584', bg: 'rgba(255,101,132,0.1)',  border: 'rgba(255,101,132,0.25)', icon: <AlertTriangle size={12} /> },
  needs_work:  { label: 'Needs Work',  color: '#f7971e', bg: 'rgba(247,151,30,0.1)',   border: 'rgba(247,151,30,0.25)',  icon: <AlertCircle size={12} /> },
  good:        { label: 'Good',        color: '#43e97b', bg: 'rgba(67,233,123,0.1)',   border: 'rgba(67,233,123,0.25)', icon: <CheckCircle size={12} /> },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[#1e1e32]"
    >
      {copied ? <Check size={11} className="text-[#43e97b]" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function RewriteCard({ rw, index }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#1e1e32]" >
      <div className="px-3 py-1.5 bg-[#0a0a0f] flex items-center justify-between">
        <span className="text-xs text-gray-600 font-dm">Line {index + 1}</span>
        {rw.reason && <span className="text-xs text-[#6c63ff] font-dm truncate max-w-[60%]">{rw.reason}</span>}
      </div>
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e1e32]">
        {/* Before */}
        <div className="p-3 space-y-1.5">
          <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#ff6584]">Before</p>
          <p className="text-xs text-gray-400 font-dm leading-relaxed">{rw.original}</p>
        </div>
        {/* After */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#43e97b]">Optimized</p>
            <CopyButton text={rw.optimized} />
          </div>
          <p className="text-xs text-gray-200 font-dm leading-relaxed">{rw.optimized}</p>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ section, index }) {
  const cfg = STATUS_CONFIG[section.status] || STATUS_CONFIG.needs_work
  const [open, setOpen] = useState(section.status === 'weak' || section.status === 'needs_work')
  const scoreGain = (section.targetScore || 0) - (section.currentScore || 0)

  // Copy all optimized rewrites for this section at once
  const allOptimized = section.rewrites?.map(r => r.optimized).join('\n\n') || ''

  return (
    <div
      className="rounded-2xl border overflow-hidden animate-fadeIn card-hover"
      style={{ borderColor: cfg.border, animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5"
        style={{ background: cfg.bg }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ color: cfg.color }}>{cfg.icon}</span>
          <span className="font-syne font-bold text-sm text-white truncate">{section.name}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-syne font-semibold shrink-0"
            style={{ background: `${cfg.color}20`, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Score bar mini */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-500 font-dm">{section.currentScore}→</span>
            <span className="text-xs font-bold font-syne" style={{ color: cfg.color }}>{section.targetScore}</span>
            {scoreGain > 0 && (
              <span className="text-xs text-[#43e97b] font-syne font-bold">+{scoreGain}</span>
            )}
          </div>
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">

          {/* Issues */}
          {section.issues?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-syne font-bold uppercase tracking-wider text-gray-500">Issues Found</p>
              {section.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-400 font-dm">
                  <span className="mt-1 shrink-0" style={{ color: cfg.color }}>•</span>
                  {issue}
                </div>
              ))}
            </div>
          )}

          {/* Keywords to add */}
          {section.keywordsToAdd?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-syne font-bold uppercase tracking-wider text-gray-500">
                <Tag size={10} className="inline mr-1" />Keywords to Add
              </p>
              <div className="flex flex-wrap gap-1.5">
                {section.keywordsToAdd.map((kw, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-dm font-medium"
                    style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff' }}
                  >
                    <Plus size={9} />{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rewrites */}
          {section.rewrites?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-syne font-bold uppercase tracking-wider text-gray-500">
                  Line-by-Line Rewrites ({section.rewrites.length})
                </p>
                {section.rewrites.length > 1 && (
                  <CopyButton text={allOptimized} />
                )}
              </div>
              <div className="space-y-2">
                {section.rewrites.map((rw, i) => (
                  <RewriteCard key={i} rw={rw} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* New content to add */}
          {section.newContent && (
            <div className="space-y-2">
              <p className="text-xs font-syne font-bold uppercase tracking-wider text-gray-500">
                <Plus size={10} className="inline mr-1" />New Content to Add
              </p>
              <div className="relative p-3 rounded-xl bg-[#43e97b08] border border-[#43e97b25]">
                <p className="text-xs text-gray-200 font-dm leading-relaxed whitespace-pre-line pr-12">
                  {section.newContent}
                </p>
                <div className="absolute top-2 right-2">
                  <CopyButton text={section.newContent} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CVUpgrade({ cvUpgrade, currentScore }) {
  if (!cvUpgrade?.sections?.length) {
    return (
      <div className="text-center py-10 text-gray-500 font-dm text-sm">
        No upgrade data available. Re-analyze your resume to generate the full CV upgrade plan.
      </div>
    )
  }

  const weak = cvUpgrade.sections.filter(s => s.status === 'weak')
  const needs = cvUpgrade.sections.filter(s => s.status === 'needs_work')
  const good  = cvUpgrade.sections.filter(s => s.status === 'good')

  const totalRewrites = cvUpgrade.sections.reduce((n, s) => n + (s.rewrites?.length || 0), 0)

  return (
    <div className="space-y-5">
      {/* Top summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#ff658410] border border-[#ff658425] text-center">
          <p className="text-xl font-syne font-bold text-[#ff6584]">{weak.length}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Weak sections</p>
        </div>
        <div className="p-3 rounded-xl bg-[#f7971e10] border border-[#f7971e25] text-center">
          <p className="text-xl font-syne font-bold text-[#f7971e]">{needs.length}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Need work</p>
        </div>
        <div className="p-3 rounded-xl bg-[#6c63ff10] border border-[#6c63ff25] text-center">
          <p className="text-xl font-syne font-bold text-[#6c63ff]">{totalRewrites}</p>
          <p className="text-xs text-gray-500 font-dm mt-0.5">Lines to rewrite</p>
        </div>
      </div>

      {/* Summary of changes */}
      {cvUpgrade.summaryOfChanges && (
        <div className="p-3.5 rounded-xl bg-[#6c63ff10] border border-[#6c63ff25] text-sm text-gray-300 font-dm leading-relaxed">
          {cvUpgrade.summaryOfChanges}
        </div>
      )}

      {/* Sections grouped by priority */}
      {weak.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-syne font-bold uppercase tracking-widest text-[#ff6584]">🚨 Weak Sections — Fix First</p>
          {weak.map((s, i) => <SectionCard key={s.name} section={s} index={i} />)}
        </div>
      )}

      {needs.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-syne font-bold uppercase tracking-widest text-[#f7971e]">⚠️ Needs Improvement</p>
          {needs.map((s, i) => <SectionCard key={s.name} section={s} index={i + weak.length} />)}
        </div>
      )}

      {good.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-syne font-bold uppercase tracking-widest text-[#43e97b]">✅ Already Good — Minor Tweaks</p>
          {good.map((s, i) => <SectionCard key={s.name} section={s} index={i + weak.length + needs.length} />)}
        </div>
      )}
    </div>
  )
}
