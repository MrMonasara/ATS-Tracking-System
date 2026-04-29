import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

function Tag({ word, type }) {
  const styles = {
    matched: {
      bg: 'rgba(67,233,123,0.12)',
      border: 'rgba(67,233,123,0.3)',
      text: '#43e97b',
      icon: <CheckCircle size={11} />,
    },
    partial: {
      bg: 'rgba(247,151,30,0.12)',
      border: 'rgba(247,151,30,0.3)',
      text: '#f7971e',
      icon: <AlertCircle size={11} />,
    },
    missing: {
      bg: 'rgba(255,101,132,0.12)',
      border: 'rgba(255,101,132,0.3)',
      text: '#ff6584',
      icon: <XCircle size={11} />,
    },
  }
  const s = styles[type]

  return (
    <span
      className="kw-tag"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {s.icon}
      {word}
    </span>
  )
}

export default function KeywordGrid({ keywordMatch }) {
  const { matched = [], partial = [], missing = [] } = keywordMatch
  const total = matched.length + partial.length + missing.length
  const found = matched.length + partial.length

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400 font-dm">
          <span className="text-white font-semibold">{found}</span>/{total} keywords matched
        </span>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="text-[#43e97b]">✓ {matched.length} found</span>
          <span className="text-[#f7971e]">~ {partial.length} partial</span>
          <span className="text-[#ff6584]">✗ {missing.length} missing</span>
        </div>
      </div>

      {/* Match progress bar */}
      <div className="h-1.5 rounded-full bg-[#1e1e32] overflow-hidden flex">
        <div
          className="h-full rounded-l-full transition-all duration-1000"
          style={{ width: `${(matched.length / Math.max(total, 1)) * 100}%`, background: '#43e97b' }}
        />
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${(partial.length / Math.max(total, 1)) * 100}%`, background: '#f7971e' }}
        />
        <div
          className="h-full rounded-r-full transition-all duration-1000"
          style={{ width: `${(missing.length / Math.max(total, 1)) * 100}%`, background: '#ff6584' }}
        />
      </div>

      {/* Matched */}
      {matched.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#43e97b] uppercase tracking-wider mb-2 font-syne">Found in Resume</p>
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => <Tag key={i} word={kw} type="matched" />)}
          </div>
        </div>
      )}

      {/* Partial */}
      {partial.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#f7971e] uppercase tracking-wider mb-2 font-syne">Partial / Implied</p>
          <div className="flex flex-wrap gap-2">
            {partial.map((kw, i) => <Tag key={i} word={kw} type="partial" />)}
          </div>
        </div>
      )}

      {/* Missing */}
      {missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#ff6584] uppercase tracking-wider mb-2 font-syne">Missing Keywords</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => <Tag key={i} word={kw} type="missing" />)}
          </div>
        </div>
      )}
    </div>
  )
}
