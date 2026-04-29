import { ArrowRight, Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function RewriteCard({ rewrite, index }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrite.optimized)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl border border-[#1e1e32] overflow-hidden animate-fadeIn card-hover"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="px-4 py-2 bg-[#1e1e32] flex items-center justify-between">
        <span className="text-xs font-syne font-semibold text-gray-400 uppercase tracking-wider">
          Bullet #{index + 1}
        </span>
        {rewrite.improvement && (
          <span className="text-xs text-[#6c63ff] font-dm">{rewrite.improvement}</span>
        )}
      </div>

      <div className="p-4 grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#ff6584] uppercase tracking-wider font-syne flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6584] inline-block" />
            Before
          </p>
          <div className="p-3 rounded-lg bg-[#ff658408] border border-[#ff658425] text-sm text-gray-400 font-dm leading-relaxed">
            {rewrite.original}
          </div>
        </div>

        {/* Arrow - desktop only */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ArrowRight size={16} className="text-[#6c63ff]" />
        </div>

        {/* After */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#43e97b] uppercase tracking-wider font-syne flex items-center gap-1.5">
            <Sparkles size={10} />
            ATS Optimized
          </p>
          <div className="p-3 rounded-lg bg-[#43e97b08] border border-[#43e97b25] text-sm text-gray-200 font-dm leading-relaxed">
            {rewrite.optimized}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1e1e32]"
        >
          {copied ? <Check size={12} className="text-[#43e97b]" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy optimized'}
        </button>
      </div>
    </div>
  )
}

export default function RewritePanel({ rewrites }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#6c63ff10] border border-[#6c63ff20]">
        <Sparkles size={14} className="text-[#6c63ff]" />
        <p className="text-xs text-gray-400 font-dm">
          These rewrites use exact JD keywords to maximize ATS matching. Copy them directly into your resume.
        </p>
      </div>
      {rewrites.map((r, i) => (
        <RewriteCard key={i} rewrite={r} index={i} />
      ))}
    </div>
  )
}
